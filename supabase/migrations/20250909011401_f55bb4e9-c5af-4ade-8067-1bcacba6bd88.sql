-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pieces table
CREATE TABLE public.pieces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'rented')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create store_settings table
CREATE TABLE public.store_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name TEXT DEFAULT 'LooksdeHoje',
  instagram_url TEXT,
  whatsapp_url TEXT,
  email TEXT,
  admin_password TEXT NOT NULL DEFAULT 'admin123',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default categories
INSERT INTO public.categories (name) VALUES 
  ('Vestidos'),
  ('Sociais'),
  ('Festa'),
  ('Frio'),
  ('Calor');

-- Insert default store settings
INSERT INTO public.store_settings (store_name, admin_password) VALUES 
  ('LooksdeHoje', 'admin123');

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no user authentication)
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can manage categories" ON public.categories FOR ALL USING (true);

CREATE POLICY "Public can view pieces" ON public.pieces FOR SELECT USING (true);
CREATE POLICY "Public can manage pieces" ON public.pieces FOR ALL USING (true);

CREATE POLICY "Public can view store settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Public can manage store settings" ON public.store_settings FOR ALL USING (true);

-- Create storage bucket for piece images
INSERT INTO storage.buckets (id, name, public) VALUES ('pieces', 'pieces', true);

-- Create storage policies
CREATE POLICY "Public can view piece images" ON storage.objects FOR SELECT USING (bucket_id = 'pieces');
CREATE POLICY "Public can upload piece images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pieces');
CREATE POLICY "Public can update piece images" ON storage.objects FOR UPDATE USING (bucket_id = 'pieces');
CREATE POLICY "Public can delete piece images" ON storage.objects FOR DELETE USING (bucket_id = 'pieces');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pieces_updated_at
  BEFORE UPDATE ON public.pieces
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_store_settings_updated_at
  BEFORE UPDATE ON public.store_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();