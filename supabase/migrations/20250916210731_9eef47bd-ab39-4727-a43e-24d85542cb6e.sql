-- Create hero_settings table for managing HeroSection content
CREATE TABLE public.hero_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slides JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for hero_settings
CREATE POLICY "Hero settings are viewable by everyone" 
ON public.hero_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Hero settings can be managed by everyone" 
ON public.hero_settings 
FOR ALL
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_hero_settings_updated_at
BEFORE UPDATE ON public.hero_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for hero images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for hero images
CREATE POLICY "Hero images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'hero-images');

CREATE POLICY "Anyone can upload hero images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'hero-images');

CREATE POLICY "Anyone can update hero images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'hero-images');

CREATE POLICY "Anyone can delete hero images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'hero-images');

-- Insert initial hero settings with current data
INSERT INTO public.hero_settings (slides) VALUES (
  '[
    {
      "id": "slide-1",
      "title": "Elegância em Cada Ocasião",
      "subtitle": "Alugue looks únicos para momentos especiais",
      "image_url": "/src/assets/hero-dress-1.jpg"
    },
    {
      "id": "slide-2", 
      "title": "Estilo Sofisticado",
      "subtitle": "Descubra a coleção mais exclusiva da cidade",
      "image_url": "/src/assets/hero-dress-2.jpg"
    },
    {
      "id": "slide-3",
      "title": "Luxo Acessível", 
      "subtitle": "Vista-se com elegância sem comprometer o orçamento",
      "image_url": "/src/assets/hero-dress-3.jpg"
    }
  ]'
);