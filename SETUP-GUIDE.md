# Portfolio CMS — Setup Guide

This build keeps the existing static HTML/CSS/JavaScript portfolio and adds a private Supabase-powered CMS.

## 1) Configure Supabase

1. Open your existing Supabase project dashboard.
2. Go to **SQL Editor → New query**.
3. Because you already have a project, run `supabase-upgrade-v2.sql` (not the original schema file) to refresh the policies and media bucket without resetting data. For a brand-new empty Supabase project only, run `supabase-schema.sql` first.
4. Go to **Project Settings → API** (or API Keys) and copy the Project URL and the **publishable key** (or legacy anon/public key).
5. Open `supabase-config.js` and replace the two placeholders:

```js
window.PORTFOLIO_SUPABASE_CONFIG = {
  url: 'https://YOUR_PROJECT_REF.supabase.co',
  anonKey: 'YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY'
};
```

Use only the browser-safe publishable/anon key here. **Never put the `service_role` key or any secret key in frontend files.**

## 2) Create your admin login

1. In Supabase, open **Authentication → Users → Add user**.
2. Create your admin user with your email and a strong password. Keep public sign-ups disabled.
3. In SQL Editor, run this statement with the same email:

```sql
insert into public.portfolio_admins(user_id)
select id from auth.users where email = 'YOUR_ADMIN_EMAIL'
on conflict (user_id) do nothing;
```

The admin login is allowlisted by the `portfolio_admins` table. Creating an Auth user alone does not grant dashboard access.

## 3) Open the admin dashboard

- Local development: `http://localhost:YOUR_PORT/admin/`
- Deployed site: `https://YOUR_DOMAIN/admin/`

Sign in using the email/password created in Supabase Authentication.

## 4) Deploy

Upload the complete project folder, including `admin/`, `cms-public.js`, `supabase-config.js` and `supabase-schema.sql`, to your static host. Keep the `admin` folder path intact. The site must be served over HTTPS in production.

## 5) Scheduled publishing

Projects can be saved with `scheduled` status and a `publish_at` time. For automatic publishing, enable `pg_cron` in your Supabase project if available, then run:

```sql
select cron.schedule(
  'publish-portfolio-projects',
  '* * * * *',
  $$select public.publish_due_portfolio_projects();$$
);
```

If `pg_cron` is unavailable on your plan/project, use a trusted scheduled Edge Function to invoke the function. Do not expose a service-role key in the browser.

## CMS modules included

- Profile & Hero, Projects, Skills, Experience, Education, Certificates, Testimonials, Blog & Articles
- Resume, Sections & Layout, Appearance, SEO & Social, Media Library
- Contact Messages, Analytics, Version History and Settings

Content managers store their data in `portfolio_content`; projects are stored in `portfolio_projects`. The public page reads published projects and managed content from Supabase. The existing static portfolio remains the fallback until Supabase is configured and the initial data is available.

## Important notes

- The current seed migration preserves the four project cards already present in the supplied portfolio. Review their descriptions and links before presenting them as verified work.
- Image fields now have a preview, a dropdown to choose existing Media Library images, and a direct upload control. No manual image URL paste is needed for those fields.
- The contact form writes submissions to `portfolio_messages` after the CMS is connected.
- Analytics starts collecting events after the connected public site is deployed; historical visits are not backfilled.
- Version history stores snapshots when project/content records are updated or deleted. Restoring a snapshot writes a new current version.
- Keep secrets, private API keys and confidential company data out of public content.


## CMS connection and media picker update (v2)
1. Replace the placeholder values in `supabase-config.js` with your Supabase Project URL and publishable/anon key.
2. In Supabase SQL Editor, run `supabase-upgrade-v2.sql` once. It re-applies the public content read policy, admin policies and Storage bucket rules safely.
3. Ensure your signed-in user has a row in `public.portfolio_admins`.
4. Open `/admin/`, sign in, then use **Tools I Use** to edit the tool list.
5. For image fields, choose an existing image from the dropdown or upload a new image directly. Files are stored in the `portfolio-media` bucket.

The tools section ships with an editable starter list. Confirm every listed tool reflects your actual usage before publishing.


### Existing Supabase project: recommended update order
- Do not reset or delete existing tables.
- Run `supabase-upgrade-v2.sql` in SQL Editor to refresh policies/grants and ensure the media bucket exists.
- Keep your existing `portfolio_admins` membership row; if login says unauthorized, add your Auth user's UUID to that table.
- The new image picker uploads files to the root of `portfolio-media`, so the media dropdown can list them reliably.
