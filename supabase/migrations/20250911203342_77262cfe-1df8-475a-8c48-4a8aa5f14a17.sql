-- Add description and measurements fields to pieces table
ALTER TABLE public.pieces 
ADD COLUMN description TEXT,
ADD COLUMN measurements JSONB;