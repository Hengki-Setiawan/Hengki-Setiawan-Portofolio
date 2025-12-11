-- Create admin user
-- Email: hengkisetiawan461@gmail.com
-- Password: SHADOWofsetiawan164

-- This SQL creates a user in Supabase Auth
-- Run this in Supabase Dashboard > SQL Editor

-- Note: For security, you should create users through the Supabase Dashboard UI
-- Go to: Authentication > Users > Add User
-- 
-- But if you prefer SQL, you can use the auth.users table
-- However, inserting directly into auth.users requires admin access and proper hashing
-- 
-- The easiest way is through the Dashboard:
-- 1. Go to Supabase Dashboard
-- 2. Click Authentication > Users
-- 3. Click "Add user" 
-- 4. Enter:
--    - Email: hengkisetiawan461@gmail.com
--    - Password: SHADOWofsetiawan164
--    - Auto Confirm User: YES (check this box)
-- 5. Click Create User

-- Alternative: Use Supabase Auth API (requires service_role_key)
-- This would need to be done programmatically, not via SQL
