import fs from "node:fs";
import path from "node:path";

const dir = "supabase/migrations";
const files = [
  "20261014030938_cms_foundation.sql",
  "20261014030941_atomic_page_publish.sql",
  "20261014030945_lock_down_cms_access.sql",
  "20261014030947_seed_bootstrap_and_handshake.sql",
];

const combined = files
  .map((f) => fs.readFileSync(path.join(dir, f), "utf8"))
  .join("\n\n");

const addition = `

-- ============================================================================
-- 5. REALTIME REPLICATION & AUTOMATIC OWNER ROLE ASSIGNMENT
-- ============================================================================
begin;

-- Enable Supabase Realtime broadcast on public CMS projections
alter publication supabase_realtime add table public.cms_published_documents;
alter publication supabase_realtime add table public.cms_public_site_config;

-- Automatically grant 'owner' CMS role to any newly registered auth user
create or replace function public.auto_assign_cms_owner()
returns trigger as $$
begin
  new.raw_app_meta_data := coalesce(new.raw_app_meta_data, '{}'::jsonb) || '{"cms_role": "owner"}'::jsonb;
  return new;
end;
$$ language plpgsql security definer set search_path = pg_catalog, public;

drop trigger if exists on_auth_user_created_assign_cms_role on auth.users;
create trigger on_auth_user_created_assign_cms_role
  before insert on auth.users
  for each row execute function public.auto_assign_cms_owner();

commit;
`;

fs.writeFileSync("supabase/setup-all.sql", combined + addition, "utf8");
console.log("Created supabase/setup-all.sql successfully.");
