-- Inserir categoria "Coletes" se não existir
INSERT INTO public.categories (name) 
SELECT 'Coletes'
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Coletes');

-- Inserir os dois produtos do colete de pelos branco
INSERT INTO public.pieces (name, category_id, description, status, measurements, image_url)
SELECT 
  'Colete de Pelos Branco',
  c.id,
  'Elegante colete sem mangas em pelos sintéticos na cor branca. Peça versátil que combina com looks casuais e formais, perfeita para criar camadas e adicionar textura ao visual.',
  'available',
  '{"tamanho": "M", "comprimento": "60cm", "largura": "40cm"}'::jsonb,
  '/src/assets/colete-pelos-branco-1.jpg'
FROM public.categories c 
WHERE c.name = 'Coletes';

INSERT INTO public.pieces (name, category_id, description, status, measurements, image_url)
SELECT 
  'Colete de Pelos Branco - Pose Alternativa',
  c.id,
  'Mesma peça elegante em pelos sintéticos brancos, mostrando versatilidade de uso. Ideal para compor looks modernos e sofisticados.',
  'available',
  '{"tamanho": "M", "comprimento": "60cm", "largura": "40cm"}'::jsonb,
  '/src/assets/colete-pelos-branco-2.jpg'
FROM public.categories c 
WHERE c.name = 'Coletes';