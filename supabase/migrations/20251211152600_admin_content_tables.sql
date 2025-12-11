-- ============================================
-- Enhanced Admin Dashboard - Content Tables
-- ============================================

-- 1. Site Content (Profile, Hero, About)
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default site content
INSERT INTO site_content (key, value) VALUES
  ('hero_name', 'Hengki Setiawan'),
  ('hero_roles', 'Digital Business Student • Meme Creator • E-commerce Merchant • Web Developer'),
  ('hero_tagline', 'Transforming ideas into digital reality'),
  ('about_bio', 'Mahasiswa Digital Business yang passionate tentang teknologi, e-commerce, dan membangun komunitas online. Saya mengelola beberapa grup Facebook dengan total 600K+ member.'),
  ('about_location', 'Indonesia'),
  ('profile_image', '/images/profile.jpg')
ON CONFLICT (key) DO NOTHING;

-- RLS for site_content
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read site_content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Allow authenticated update site_content" ON site_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert site_content" ON site_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 2. Services Table
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'Briefcase',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default services
INSERT INTO services (title, description, icon, order_index) VALUES
  ('Web Development', 'Membuat website modern dan responsive dengan teknologi terkini', 'Code', 1),
  ('E-commerce Solutions', 'Setup dan optimasi toko online di Shopee, Tokopedia, dan platform lainnya', 'ShoppingBag', 2),
  ('Community Building', 'Membangun dan mengelola komunitas online yang engaged', 'Users', 3),
  ('Digital Marketing', 'Strategi pemasaran digital untuk meningkatkan brand awareness', 'TrendingUp', 4)
ON CONFLICT DO NOTHING;

-- RLS for services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all services" ON services FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 3. FAQs Table
-- ============================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default FAQs
INSERT INTO faqs (question, answer, order_index) VALUES
  ('Bagaimana cara menghubungi Anda?', 'Anda bisa menghubungi saya melalui form kontak di website ini atau langsung via WhatsApp/email.', 1),
  ('Apa saja layanan yang Anda tawarkan?', 'Saya menawarkan web development, konsultasi e-commerce, dan community building.', 2),
  ('Berapa lama waktu pengerjaan project?', 'Tergantung kompleksitas project. Website sederhana bisa selesai dalam 1-2 minggu.', 3)
ON CONFLICT DO NOTHING;

-- RLS for faqs
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 4. Experiences Table
-- ============================================
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  period VARCHAR(100) NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default experiences
INSERT INTO experiences (title, role, period, description, order_index) VALUES
  ('Kaos Kami', 'Founder & Owner', '2021 - Present', 'Mengelola bisnis e-commerce fashion dengan 1250+ produk terjual', 1),
  ('Facebook Communities', 'Community Admin', '2020 - Present', 'Mengelola 3 grup Facebook dengan total 600K+ member aktif', 2),
  ('Digital Business UMY', 'Student', '2023 - Present', 'Mempelajari strategi bisnis digital dan e-commerce', 3)
ON CONFLICT DO NOTHING;

-- RLS for experiences
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all experiences" ON experiences FOR ALL USING (auth.role() = 'authenticated');
