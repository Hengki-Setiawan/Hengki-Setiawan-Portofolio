-- =====================================================
-- MEDIA SHOWCASE TABLE - For videos and GIFs
-- =====================================================

CREATE TABLE IF NOT EXISTS public.media_showcase (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    media_type TEXT NOT NULL CHECK (media_type IN ('video', 'gif', 'image')),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    platform TEXT, -- tiktok, instagram, youtube, etc
    external_link TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.media_showcase ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable read access for all users" ON public.media_showcase
    FOR SELECT TO public USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.media_showcase
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON public.media_showcase
    FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON public.media_showcase
    FOR DELETE TO authenticated USING (true);

-- Insert sample data
INSERT INTO public.media_showcase (title, description, media_type, media_url, platform, external_link, order_index) VALUES
    ('Konten Viral TikTok', 'Video konten meme yang viral di TikTok', 'video', '/videos/sample.mp4', 'tiktok', 'https://www.tiktok.com/@hengki.skizo', 1),
    ('Behind The Scene', 'Proses pembuatan konten kreatif', 'gif', '/images/bts.gif', 'instagram', 'https://www.instagram.com/hengkimiau', 2),
    ('Product Showcase', 'Showcase produk Kaos Kami', 'image', '/images/product-showcase.jpg', 'shopee', 'https://shopee.co.id/hengki_setiawan', 3);
