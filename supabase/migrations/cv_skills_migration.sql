-- Skills Table
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'business', 'creative', 'tech'
  title TEXT NOT NULL,
  items TEXT[] NOT NULL, -- Array of strings for list items
  icon_name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CV Entries Table
CREATE TABLE cv_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL, -- 'education', 'experience', 'certification', 'organization'
  title TEXT NOT NULL,
  subtitle TEXT, -- School name, Company name, etc.
  date_range TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CV Profile (Summary & Contact Override)
CREATE TABLE cv_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  website_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_profile ENABLE ROW LEVEL SECURITY;

-- Policies (Public Read, Authenticated Write)
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Admin update skills" ON skills FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read cv_entries" ON cv_entries FOR SELECT USING (true);
CREATE POLICY "Admin update cv_entries" ON cv_entries FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read cv_profile" ON cv_profile FOR SELECT USING (true);
CREATE POLICY "Admin update cv_profile" ON cv_profile FOR ALL USING (auth.role() = 'authenticated');

-- Insert Default Skills Data (Migration from hardcoded)
INSERT INTO skills (category, title, items, icon_name, order_index) VALUES
('business', 'Bisnis & Manajemen', ARRAY['Community Management', 'Digital Marketing', 'Business Operations'], 'TrendingUp', 0),
('creative', 'Kreatif & Konten', ARRAY['Meme Creation', 'Content Strategy', 'Copywriting'], 'PenTool', 1),
('tech', 'Teknologi Web', ARRAY['Fullstack Web Dev', 'Automation', 'Vibe Coding'], 'Code2', 2);

-- Insert Default CV Profile
INSERT INTO cv_profile (summary, contact_email, contact_phone, address, website_url) VALUES
('Mahasiswa Bisnis Digital yang memiliki passion di bidang pengembangan web dan konten kreatif. Berpengalaman dalam membangun brand clothing dan mengelola komunitas online.', 'hengki@example.com', '+62 812-3456-7890', 'Makassar, Indonesia', 'https://hengkisetiawan.com');
