-- Ventures Table (for Store, Communities, Projects)
CREATE TABLE ventures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  role TEXT NOT NULL, -- e.g. 'Clothing Brand', 'Digital Community'
  description TEXT,
  link TEXT,
  icon_name TEXT, -- 'Shirt', 'MessageCircle', etc.
  color_class TEXT, -- e.g. 'bg-orange-500'
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE ventures ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for all users" ON ventures FOR SELECT TO public USING (true);
CREATE POLICY "Enable all access for authenticated users" ON ventures FOR ALL TO authenticated USING (true);

-- Insert default data
INSERT INTO ventures (title, role, description, link, icon_name, color_class, order_index) VALUES
('Kaos Kami', 'Clothing Brand', 'Brand fashion lokal dengan desain yang relevan untuk Gen Z. Fokus pada kualitas bahan dan pesan visual yang unik.', '#', 'Shirt', 'bg-orange-500', 0),
('Kami Depresi dan Bahagia', 'Digital Community', 'Ruang aman digital untuk berekspresi. Menggabungkan humor (meme) dengan dukungan komunitas (peer support).', '#', 'MessageCircle', 'bg-blue-500', 1);
