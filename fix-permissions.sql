-- ==============================================================================
-- RUN THIS IN SUPABASE SQL EDITOR TO GRANT FULL PERMISSIONS TO API ROLES
-- ==============================================================================

-- 1. Grant Schema Usage
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Ensure screenshots column exists in projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS screenshots JSONB NOT NULL DEFAULT '[]'::jsonb;

-- 2. Grant Table & Sequence Privileges
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 3. Set Default Privileges for Future Tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- 4. Enable Row Level Security (RLS) with full read/write access policies
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'projects', 'project_media', 'credentials', 'education', 
    'experience', 'skill_categories', 'skills', 'personal_profile', 
    'documents', 'contact_messages'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    BEGIN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
      EXECUTE format('DROP POLICY IF EXISTS "Public select policy" ON public.%I;', t);
      EXECUTE format('DROP POLICY IF EXISTS "Full access policy" ON public.%I;', t);
      EXECUTE format('CREATE POLICY "Public select policy" ON public.%I FOR SELECT USING (true);', t);
      EXECUTE format('CREATE POLICY "Full access policy" ON public.%I FOR ALL USING (true) WITH CHECK (true);', t);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Skipping table % (not found or error)', t;
    END;
  END LOOP;
END $$;
