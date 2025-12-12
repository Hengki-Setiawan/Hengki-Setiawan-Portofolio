-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read published articles
CREATE POLICY "Anyone can read published articles" ON articles
  FOR SELECT
  USING (is_published = true);

-- Create policy to allow admins to manage articles (insert/update/delete)
-- Assuming admin check is done via app logic or separate admin role table, 
-- but for now we'll allow authenticated users to insert (refine later)
CREATE POLICY "Authenticated users can insert articles" ON articles
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update articles" ON articles
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete articles" ON articles
  FOR DELETE
  USING (auth.role() = 'authenticated');
