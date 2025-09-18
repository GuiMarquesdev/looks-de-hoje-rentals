-- Add support for multiple images per piece
ALTER TABLE public.pieces 
ADD COLUMN images JSONB DEFAULT '[]'::jsonb;

-- Create index for better performance on images column
CREATE INDEX idx_pieces_images ON public.pieces USING GIN(images);

-- Update existing pieces to migrate single image_url to images array
UPDATE public.pieces 
SET images = CASE 
  WHEN image_url IS NOT NULL AND image_url != '' 
  THEN jsonb_build_array(jsonb_build_object('url', image_url, 'order', 0))
  ELSE '[]'::jsonb
END
WHERE images = '[]'::jsonb;

-- The image_url column will be kept for backward compatibility
-- but we'll primarily use the new images column