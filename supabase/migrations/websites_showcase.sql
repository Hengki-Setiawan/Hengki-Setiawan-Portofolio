-- =====================================================
-- WEBSITES SHOWCASE TABLE - For external websites/projects
-- =====================================================

CREATE TABLE IF NOT EXISTS public.websites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT, -- ecommerce, corporate, portfolio, etc
    technologies TEXT[], -- array of tech stack
    status TEXT DEFAULT 'live', -- live, maintenance, archived
    featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable read access for all users" ON public.websites
    FOR SELECT TO public USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.websites
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON public.websites
    FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users" ON public.websites
    FOR DELETE TO authenticated USING (true);

-- Insert sample data
INSERT INTO public.websites (title, description, url, thumbnail_url, category, technologies, status, featured, order_index) VALUES
    ('Moodlab E-commerce', 'Website e-commerce Agneso untuk produk fashion dan merchandise', 'https://www.moodlab.web.id/', '/images/moodlab-preview.jpg', 'ecommerce', ARRAY['React', 'Next.js', 'Tailwind CSS', 'Supabase'], 'live', true, 1);
