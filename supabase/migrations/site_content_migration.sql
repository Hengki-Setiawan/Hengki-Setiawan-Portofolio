-- ================================================
-- Site Content Table for Managing Website Content
-- ================================================
-- Run this SQL in Supabase Dashboard > SQL Editor

-- Create site_content table
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(section, key)
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Enable read access for all users" ON public.site_content
    FOR SELECT TO public USING (true);

-- Allow authenticated users to manage content
CREATE POLICY "Enable insert for authenticated users" ON public.site_content
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.site_content
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete for authenticated users" ON public.site_content
    FOR DELETE TO authenticated USING (true);

-- ================================================
-- Insert Default Hero Content
-- ================================================
INSERT INTO public.site_content (section, key, value, order_index) VALUES
    ('hero', 'greeting', 'Selamat Datang di Portofolio Saya', 0),
    ('hero', 'hello_text', 'Hello,', 1),
    ('hero', 'name_first', 'Hengki', 2),
    ('hero', 'name_last', 'Setiawan', 3),
    ('hero', 'role_1', 'Digital Business Student', 4),
    ('hero', 'role_2', 'Meme Creator', 5),
    ('hero', 'role_3', 'E-commerce Merchant', 6),
    ('hero', 'role_4', 'Web Developer', 7),
    ('hero', 'description', 'Mahasiswa Universitas Negeri Makassar yang menggabungkan naluri bisnis, kreativitas konten, dan teknologi untuk menciptakan dampak nyata.', 8),
    ('hero', 'cta_primary', 'Ayo Bicara', 9),
    ('hero', 'cta_secondary', 'Download CV', 10),
    ('hero', 'cv_url', '#', 11),
    ('hero', 'linkedin_url', 'https://www.linkedin.com/in/hengki-setiawan-8064a6353', 12),
    ('hero', 'instagram_url', 'https://www.instagram.com/hengkimiau?igsh=MW9ycDR2NW1ueXZ0eg==', 13),
    ('hero', 'github_url', 'https://github.com/Hengki-Setiawan', 14),
    ('hero', 'badge_1_emoji', '🎓', 15),
    ('hero', 'badge_1_title', 'Mahasiswa', 16),
    ('hero', 'badge_1_subtitle', 'Bisnis Digital', 17),
    ('hero', 'badge_2_emoji', '👑', 18),
    ('hero', 'badge_2_text', 'Owner Kaos Kami', 19)
ON CONFLICT (section, key) DO NOTHING;

-- Insert Hero Image
INSERT INTO public.site_content (section, key, image_url, order_index) VALUES
    ('hero', 'main_image', '/images/hengki-photo.jpg', 20)
ON CONFLICT (section, key) DO NOTHING;

-- ================================================
-- Insert Default About Content
-- ================================================
INSERT INTO public.site_content (section, key, value, order_index) VALUES
    ('about', 'section_label', 'Tentang Saya', 0),
    ('about', 'title_1', 'Lebih dari sekadar', 1),
    ('about', 'title_highlight', 'Mahasiswa.', 2),
    ('about', 'title_2', 'Seorang Praktisi Digital.', 3),
    ('about', 'description_1', 'Halo! Saya Hengki Setiawan. Saya percaya bahwa era digital membutuhkan generalis yang spesifik.', 4),
    ('about', 'description_2', 'Sebagai mahasiswa Bisnis Digital di Universitas Negeri Makassar, saya tidak hanya belajar teori. Saya mempraktikkannya dengan membangun brand clothing sendiri, mengelola komunitas online yang aktif, dan mengembangkan skill teknis dalam pengembangan web & otomasi.', 5),
    ('about', 'card_1_title', 'Pendidikan', 6),
    ('about', 'card_1_desc', 'Mahasiswa Bisnis Digital (UNM)', 7),
    ('about', 'card_1_subdesc', 'Alumni SMK 4 Makassar', 8),
    ('about', 'card_2_title', 'Fokus Utama', 9),
    ('about', 'card_2_desc', 'Business Development & Tech', 10),
    ('about', 'card_3_title', 'Pengalaman', 11),
    ('about', 'card_3_desc', 'Owner, Admin & Ex-Retail', 12),
    ('about', 'card_4_title', 'Domisili', 13),
    ('about', 'card_4_desc', 'Makassar, Indonesia', 14)
ON CONFLICT (section, key) DO NOTHING;

-- Insert About Images (carousel)
INSERT INTO public.site_content (section, key, value, image_url, order_index) VALUES
    ('about', 'image_1', '🏆 Juara 1 - Tim Achievement', '/images/hengki-team.jpg', 15),
    ('about', 'image_2', '✨ Pencapaian & Prestasi', '/images/hengki-award.jpg', 16)
ON CONFLICT (section, key) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_site_content_updated_at ON public.site_content;
CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON public.site_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
