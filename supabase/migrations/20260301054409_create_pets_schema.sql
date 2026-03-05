-- Create Pets table
CREATE TABLE IF NOT EXISTS public.pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    name TEXT,
    type TEXT NOT NULL DEFAULT 'dog',
    breed TEXT,
    weight_kg TEXT,
    birth_date DATE,
    medical_notes TEXT,
    behavioral_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Pet Gallery table for Before/After
CREATE TABLE IF NOT EXISTS public.pet_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    type TEXT CHECK (type IN ('before', 'after', 'general')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_gallery ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS, but let's add basic policies for safety if accessed from client (we mostly use server actions though)
CREATE POLICY "Enable all for authenticated users" ON public.pets FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON public.pet_gallery FOR ALL USING (auth.role() = 'authenticated');

-- Create Storage Bucket for Gallery
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pet_gallery', 'pet_gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Access pet_gallery" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'pet_gallery' );

CREATE POLICY "Admin Insert pet_gallery" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'pet_gallery' AND auth.role() = 'authenticated' );

CREATE POLICY "Admin Delete pet_gallery" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'pet_gallery' AND auth.role() = 'authenticated' );

-- Migrate data: For every booking that has a pet_type/breed, create a pet for the customer if one doesn't exist
-- We use a distinct grouped query to avoid creating multiple pets for the same customer
INSERT INTO public.pets (customer_id, type, breed, weight_kg)
SELECT 
    DISTINCT ON (customer_id) 
    customer_id, 
    pet_type, 
    breed, 
    weight_kg
FROM public.bookings
WHERE pet_type IS NOT NULL
ON CONFLICT DO NOTHING;
