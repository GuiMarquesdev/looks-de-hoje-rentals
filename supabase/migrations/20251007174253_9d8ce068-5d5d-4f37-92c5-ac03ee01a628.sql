-- Add image framing fields to pieces table
ALTER TABLE public.pieces
ADD COLUMN IF NOT EXISTS image_position_x numeric DEFAULT 50,
ADD COLUMN IF NOT EXISTS image_position_y numeric DEFAULT 50,
ADD COLUMN IF NOT EXISTS image_zoom numeric DEFAULT 100;