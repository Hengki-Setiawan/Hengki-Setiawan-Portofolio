-- Ventures Table Complete Migration
-- Run this in Supabase SQL Editor to enable the Ventures feature

-- 1. Create Table
CREATE TABLE IF NOT EXISTS ventures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  role TEXT NOT NULL, -- e.g. 'Clothing Brand', 'Digital Community'
  description TEXT,
  link TEXT,
  icon_name TEXT, -- 'Shirt', 'MessageCircle', etc.
  color_class TEXT, -- e.g. 'bg-orange-500'
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  features TEXT[], -- Array of strings for bullet points
  cta_text TEXT DEFAULT 'Lihat Detail',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE ventures ENABLE ROW LEVEL SECURITY;

-- 3. Policies
DROP POLICY IF EXISTS "Enable read access for all users" ON ventures;
CREATE POLICY "Enable read access for all users" ON ventures FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON ventures;
CREATE POLICY "Enable all access for authenticated users" ON ventures FOR ALL TO authenticated USING (true);

-- 4. Insert Default Data (if table is empty)
INSERT INTO ventures (title, role, description, link, icon_name, color_class, order_index, image_url, features, cta_text)
SELECT 'Kaos Kami', 'Clothing Brand', 'Brand fashion lokal dengan desain yang relevan untuk Gen Z. Fokus pada kualitas bahan dan pesan visual yang unik.', '#', 'Shirt', 'bg-orange-500', 0, 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2669&auto=format&fit=crop', ARRAY['Bahan Cotton Combed 30s', 'Sablon Plastisol Awet', 'Desain Original & Limited'], 'Belanja Sekarang'
WHERE NOT EXISTS (SELECT 1 FROM ventures WHERE title = 'Kaos Kami');

INSERT INTO ventures (title, role, description, link, icon_name, color_class, order_index, image_url, features, cta_text)
SELECT 'Kami Depresi dan Bahagia', 'Digital Community', 'Ruang aman digital untuk berekspresi. Menggabungkan humor (meme) dengan dukungan komunitas (peer support).', '#', 'MessageCircle', 'bg-blue-500', 1, 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2664&auto=format&fit=crop', ARRAY['Komunitas Solid', 'Event Online Mingguan', 'Ruang Curhat Aman'], 'Gabung Komunitas'
WHERE NOT EXISTS (SELECT 1 FROM ventures WHERE title = 'Kami Depresi dan Bahagia');
