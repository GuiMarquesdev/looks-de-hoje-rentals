import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ProductImage {
  url: string;
  order: number;
  file?: File;
  isNew?: boolean;
}

interface MultipleImageUploadProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  images = [],
  onChange,
  maxImages = 10
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (images.length + files.length > maxImages) {
      toast.error(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    const newImages: ProductImage[] = files.map((file, index) => {
      const url = URL.createObjectURL(file);
      return {
        url,
        order: images.length + index,
        file,
        isNew: true
      };
    });

    onChange([...images, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Reorder remaining images
    const reorderedImages = newImages.map((img, i) => ({ ...img, order: i }));
    onChange(reorderedImages);
  };

  const handleReorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    
    // Update order property
    const reorderedImages = newImages.map((img, i) => ({ ...img, order: i }));
    onChange(reorderedImages);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `pieces/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('pieces')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('pieces')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const uploadAllImages = async (): Promise<ProductImage[]> => {
    setUploading(true);
    try {
      const processedImages: ProductImage[] = [];
      
      for (const image of images) {
        if (image.isNew && image.file) {
          const uploadedUrl = await uploadImage(image.file);
          processedImages.push({
            url: uploadedUrl,
            order: image.order
          });
        } else {
          processedImages.push({
            url: image.url,
            order: image.order
          });
        }
      }
      
      return processedImages;
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Imagens do Produto</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= maxImages}
        >
          <Upload className="w-4 h-4 mr-2" />
          Adicionar Fotos
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group bg-muted rounded-lg overflow-hidden aspect-square"
            >
              <img
                src={image.url}
                alt={`Imagem ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* Order indicator */}
              <div className="absolute top-2 left-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {index + 1}
              </div>
              
              {/* Drag handle */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                <GripVertical className="w-4 h-4" />
              </div>
              
              {image.isNew && (
                <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  Nova
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Clique em "Adicionar Fotos" para enviar imagens do produto
          </p>
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {images.length} de {maxImages} imagens. Arraste para reordenar.
        </p>
      )}
    </div>
  );
};

export { MultipleImageUpload };
export default MultipleImageUpload;