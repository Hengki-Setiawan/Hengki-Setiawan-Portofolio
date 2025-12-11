-- Add new columns to ventures table for richer content
ALTER TABLE ventures ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE ventures ADD COLUMN IF NOT EXISTS features TEXT[]; -- Array of strings for bullet points
ALTER TABLE ventures ADD COLUMN IF NOT EXISTS cta_text TEXT DEFAULT 'Lihat Detail';

-- Update existing data with placeholders/defaults
UPDATE ventures SET cta_text = 'Lihat Detail' WHERE cta_text IS NULL;

-- Example update for "Kaos Kami" (if it exists) to have some features
UPDATE ventures 
SET features = ARRAY['Bahan Cotton Combed 30s', 'Sablon Plastisol Awet', 'Desain Original & Limited']
WHERE title = 'Kaos Kami';

-- Example update for "Kami Depresi dan Bahagia"
UPDATE ventures 
SET features = ARRAY['Komunitas Solid', 'Event Online Mingguan', 'Ruang Curhat Aman']
WHERE title = 'Kami Depresi dan Bahagia';
