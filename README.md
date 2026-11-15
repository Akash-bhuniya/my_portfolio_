# Akash Bhuniya — Portfolio + Portfolio CMS

A responsive personal portfolio built with HTML5, CSS3 and vanilla JavaScript, now extended with a Supabase-powered private content management dashboard.

## Main features

- Existing interactive portfolio UI, theme switcher and animations
- Private admin dashboard at `/admin/`
- Project management with drafts, publishing and scheduled publishing fields
- Profile, skills, Tools I Use, experience, education, certificates, testimonials and blog managers
- Resume, appearance, section visibility/order and SEO settings
- Supabase Storage media library with upload + image dropdown pickers and previews
- Contact enquiry inbox, analytics events and version history
- PostgreSQL Row Level Security and admin allowlist

## Stack

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Supabase PostgreSQL, Auth and Storage
- Security: Supabase RLS policies and `portfolio_admins` allowlist

## Setup

Read **[SETUP-GUIDE.md](SETUP-GUIDE.md)**. For an existing Supabase project, run `supabase-upgrade-v2.sql` (do not reset existing data); for a new project, run `supabase-schema.sql`. Then configure `supabase-config.js`, create an Auth user, add its user ID to `portfolio_admins`, test the connection in Admin → Settings, and deploy the complete folder.

Never use a Supabase `service_role` key in frontend code.


## V3 responsive refresh
- Removed the public Articles section and Active In Development section.
- Replaced the long timeline with a compact swipeable milestone rail.
- Tools are mounted before Contact; Contact is moved after Tools after CMS hydration.
- Added touch-first responsive layouts, reduced-motion support, lower-cost mobile canvas effects, and a readable case-study modal.
