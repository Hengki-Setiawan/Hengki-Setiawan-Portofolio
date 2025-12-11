-- =====================================================
-- ACHIEVEMENTS TABLE - For milestones and badges
-- =====================================================

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    value TEXT,  -- e.g., "365K+", "1,250+", "Star Seller"
    icon TEXT,   -- emoji or icon name
    platform TEXT, -- facebook, shopee, tokopedia, instagram, etc
    category TEXT, -- community, sales, social, certification
    link TEXT,   -- optional link to the achievement
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create milestones table for timeline
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year TEXT NOT NULL,
    month TEXT,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT, -- business, education, community, personal
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievements
CREATE POLICY "Enable read access for all users" ON public.achievements
    FOR SELECT TO public USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.achievements
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON public.achievements
    FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON public.achievements
    FOR DELETE TO authenticated USING (true);

-- RLS Policies for milestones
CREATE POLICY "Enable read access for all users" ON public.milestones
    FOR SELECT TO public USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.milestones
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON public.milestones
    FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON public.milestones
    FOR DELETE TO authenticated USING (true);

-- Insert default achievements data
INSERT INTO public.achievements (title, description, value, icon, platform, category, link, order_index) VALUES
    ('Grup Facebook Kami Depresi', 'Komunitas terbesar dengan anggota aktif', '365K+', '👥', 'facebook', 'community', 'https://www.facebook.com/groups/kamidepresi', 1),
    ('Star Seller Tokopedia', 'Mendapat badge Star Seller di Tokopedia', '⭐', '🏆', 'tokopedia', 'certification', 'https://www.tokopedia.com/kaoskami', 2),
    ('Total Produk Terjual', 'Akumulasi penjualan di semua marketplace', '1,250+', '🛒', 'shopee', 'sales', NULL, 3),
    ('Followers Instagram', 'Total followers di Instagram', '1.2K+', '📸', 'instagram', 'social', 'https://www.instagram.com/hengkimiau', 4),
    ('TikTok Likes', 'Total likes di TikTok', '5.4K+', '🎵', 'tiktok', 'social', 'https://www.tiktok.com/@hengki.skizo', 5),
    ('Anggota Buna Moodlab', 'Komunitas kreatif dan meme', '10K+', '😄', 'facebook', 'community', NULL, 6);

-- Insert default milestones data
INSERT INTO public.milestones (year, month, title, description, icon, category, order_index) VALUES
    ('2024', 'Desember', 'Portfolio Website Launch', 'Meluncurkan website portfolio profesional dengan fitur lengkap', '🌐', 'personal', 1),
    ('2024', 'Oktober', 'Mencapai 365K Anggota', 'Grup Kami Depresi mencapai 365.000+ anggota aktif', '🎉', 'community', 2),
    ('2024', 'Juni', 'Star Seller Tokopedia', 'Mendapatkan badge Star Seller di marketplace Tokopedia', '⭐', 'business', 3),
    ('2023', 'Agustus', 'Launch Kaos Kami', 'Memulai bisnis clothing brand "Kaos Kami"', '👕', 'business', 4),
    ('2023', 'Januari', 'Memulai Kuliah', 'Diterima di jurusan Bisnis Digital, Universitas Negeri Makassar', '🎓', 'education', 5),
    ('2022', 'Maret', 'Grup 100K Anggota', 'Grup Kami Depresi mencapai 100.000 anggota pertama', '📈', 'community', 6);
