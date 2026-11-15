-- Portfolio CMS schema for Supabase PostgreSQL
-- Run this whole file in Supabase Dashboard -> SQL Editor.
-- Keep public sign-ups disabled. Never expose a service_role key in the website.

create extension if not exists pgcrypto;

create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_portfolio_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.portfolio_admins where user_id = auth.uid()); $$;

create table if not exists public.portfolio_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'other',
  short_description text not null default '',
  description text not null default '',
  technologies text[] not null default '{}',
  cover_image text not null default '',
  gallery text[] not null default '{}',
  github_url text not null default '',
  demo_url text not null default '',
  featured boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft','published','scheduled')),
  publish_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portfolio_projects_public_idx on public.portfolio_projects(status, featured desc, sort_order, created_at desc);

create table if not exists public.portfolio_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_analytics (
  id bigint generated always as identity primary key,
  event_type text not null,
  page_path text not null default '/',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists portfolio_analytics_created_idx on public.portfolio_analytics(created_at desc);

create table if not exists public.portfolio_revisions (
  id uuid primary key default gen_random_uuid(),
  resource_type text not null,
  resource_key text,
  resource_id uuid,
  action text not null default 'update',
  snapshot jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid()
);

-- Automatic snapshots for edits/deletes.
create or replace function public.capture_portfolio_content_revision()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.portfolio_revisions(resource_type,resource_key,action,snapshot)
  values ('content', old.key, case when tg_op='DELETE' then 'delete' else 'update' end, old.value);
  if tg_op='DELETE' then return old; else return new; end if;
end; $$;
drop trigger if exists portfolio_content_revision on public.portfolio_content;
create trigger portfolio_content_revision before update or delete on public.portfolio_content
for each row execute function public.capture_portfolio_content_revision();

create or replace function public.capture_portfolio_project_revision()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.portfolio_revisions(resource_type,resource_id,action,snapshot)
  values ('project', old.id, case when tg_op='DELETE' then 'delete' else 'update' end, to_jsonb(old));
  if tg_op='DELETE' then return old; else return new; end if;
end; $$;
drop trigger if exists portfolio_project_revision on public.portfolio_projects;
create trigger portfolio_project_revision before update or delete on public.portfolio_projects
for each row execute function public.capture_portfolio_project_revision();

-- Scheduled publishing function. Run it with Supabase Cron (pg_cron) every minute,
-- or invoke it from a trusted scheduled Edge Function.
create or replace function public.publish_due_portfolio_projects()
returns integer language plpgsql security definer set search_path = public
as $$
declare changed_count integer;
begin
  update public.portfolio_projects set status='published', updated_at=now()
  where status='scheduled' and publish_at is not null and publish_at <= now();
  get diagnostics changed_count = row_count;
  return changed_count;
end; $$;

alter table public.portfolio_admins enable row level security;
alter table public.portfolio_content enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_messages enable row level security;
alter table public.portfolio_analytics enable row level security;
alter table public.portfolio_revisions enable row level security;

-- Admin membership: a signed-in user may only read their own membership row.
drop policy if exists "admin can read own membership" on public.portfolio_admins;
create policy "admin can read own membership" on public.portfolio_admins for select to authenticated using (user_id = auth.uid());

-- Content can be read publicly (do not store secrets here); only admins can change it.
drop policy if exists "public read portfolio content" on public.portfolio_content;
create policy "public read portfolio content" on public.portfolio_content for select to anon, authenticated using (true);
drop policy if exists "admin manage portfolio content" on public.portfolio_content;
create policy "admin manage portfolio content" on public.portfolio_content for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

-- Public visitors only see published projects; admins have full access.
drop policy if exists "public read published projects" on public.portfolio_projects;
create policy "public read published projects" on public.portfolio_projects for select to anon, authenticated using (status='published' or public.is_portfolio_admin());
drop policy if exists "admin manage projects" on public.portfolio_projects;
create policy "admin manage projects" on public.portfolio_projects for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

-- Contact form: anyone can submit; only admins can read/update/delete.
drop policy if exists "anyone can submit contact message" on public.portfolio_messages;
create policy "anyone can submit contact message" on public.portfolio_messages for insert to anon, authenticated with check (length(trim(name)) between 1 and 100 and length(trim(email)) between 3 and 254 and length(trim(message)) between 1 and 5000);
drop policy if exists "admin manage contact messages" on public.portfolio_messages;
create policy "admin manage contact messages" on public.portfolio_messages for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

-- Analytics: public insert only; admin read.
drop policy if exists "public record analytics" on public.portfolio_analytics;
create policy "public record analytics" on public.portfolio_analytics for insert to anon, authenticated with check (length(event_type) between 1 and 60);
drop policy if exists "admin read analytics" on public.portfolio_analytics;
create policy "admin read analytics" on public.portfolio_analytics for select to authenticated using (public.is_portfolio_admin());

-- Revisions are private to admins.
drop policy if exists "admin manage revisions" on public.portfolio_revisions;
create policy "admin manage revisions" on public.portfolio_revisions for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

-- Public image bucket. Upload/update/delete restricted to admins.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('portfolio-media','portfolio-media',true,10485760,array['image/png','image/jpeg','image/webp','image/gif','image/svg+xml','application/pdf'])
on conflict (id) do update set public=true, file_size_limit=10485760;
drop policy if exists "public can view portfolio media" on storage.objects;
create policy "public can view portfolio media" on storage.objects for select to anon, authenticated using (bucket_id='portfolio-media');
drop policy if exists "admins upload portfolio media" on storage.objects;
create policy "admins upload portfolio media" on storage.objects for insert to authenticated with check (bucket_id='portfolio-media' and public.is_portfolio_admin());
drop policy if exists "admins update portfolio media" on storage.objects;
create policy "admins update portfolio media" on storage.objects for update to authenticated using (bucket_id='portfolio-media' and public.is_portfolio_admin()) with check (bucket_id='portfolio-media' and public.is_portfolio_admin());
drop policy if exists "admins delete portfolio media" on storage.objects;
create policy "admins delete portfolio media" on storage.objects for delete to authenticated using (bucket_id='portfolio-media' and public.is_portfolio_admin());

-- Create your admin login first in Supabase Authentication -> Users.
-- Then run this statement with the exact email used for that account:
-- insert into public.portfolio_admins(user_id)
-- select id from auth.users where email = 'YOUR_ADMIN_EMAIL';

-- Optional scheduled publishing setup (if pg_cron is available on your Supabase project):
-- select cron.schedule('publish-portfolio-projects','* * * * *', $$select public.publish_due_portfolio_projects();$$);

revoke all on function public.publish_due_portfolio_projects() from public, anon, authenticated;

-- Seed the four project cards that already exist in the supplied portfolio.
-- These preserve the current website content so enabling the CMS does not remove them.
insert into public.portfolio_projects(title,slug,category,short_description,description,technologies,status,featured,sort_order)
values
('TaskFlow: Full Stack Collaboration Suite','taskflow','fullstack','A collaborative task and project management application with a kanban workflow.','A full-stack collaborative application engineered to simplify agile workflow management for small-to-medium teams. Inspired by tools like Linear and Trello. Key details currently described on the portfolio include a kanban board, relational MySQL schema, REST API workflows and a responsive interface.',array['JavaScript','Node.js','Express','MySQL','WebSockets'],'published',true,1),
('NovaCommerce Web Application','novacommerce','fullstack','An e-commerce application exploring Java backend patterns and relational database design.','A shopping application described in the existing portfolio, including authentication, product catalog, cart management and an admin interface.',array['Java','MySQL','HTML5','CSS3','JavaScript'],'published',true,2),
('Modern Interactive Portfolio v2','interactive-portfolio','frontend','The interactive portfolio website with a glassmorphic interface and custom interactions.','The current portfolio website, built with HTML, CSS and vanilla JavaScript. Existing features include a canvas background, 3D card tilt, theme switching and a resume modal.',array['HTML5','CSS','Vanilla JavaScript','Canvas API'],'published',true,3),
('Pulse Mobile App Experience','pulse-mobile-ui','uiux','A mobile application prototype focused on ergonomic navigation and checkout interactions.','A mobile user experience prototype described in the existing portfolio, with a design system, mobile navigation, checkout prototype and user journey mapping.',array['Figma','Design System','Prototyping','UX Flow'],'published',false,4)
on conflict (slug) do nothing;
grant execute on function public.publish_due_portfolio_projects() to service_role;

-- Explicit table privileges (RLS policies above remain the actual row-level gate).
grant select on public.portfolio_admins to authenticated;
grant select on public.portfolio_content to anon, authenticated;
grant insert, update, delete on public.portfolio_content to authenticated;
grant select on public.portfolio_projects to anon, authenticated;
grant insert, update, delete on public.portfolio_projects to authenticated;
grant insert on public.portfolio_messages to anon, authenticated;
grant select, update, delete on public.portfolio_messages to authenticated;
grant insert on public.portfolio_analytics to anon, authenticated;
grant select on public.portfolio_analytics to authenticated;
grant select, insert, update, delete on public.portfolio_revisions to authenticated;
