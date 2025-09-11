import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import ContactChannels from '@/components/ContactChannels';

interface ProductModalProps {
  product: {
    id: string;
    name: string;
    image_url?: string;
    category?: { name: string };
    status: 'available' | 'rented';
    description?: string;
    measurements?: any;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  whatsappUrl?: string;
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  whatsappUrl = "5511999999999" 
}) => {
  if (!product) return null;

  const getContactMessage = () => {
    if (isAvailable) {
      return `Olá! Gostaria de alugar o ${product.name} do LooksdeHoje. Poderia me dar mais informações?`;
    } else {
      return `Olá, gostaria de ser avisado(a) quando a peça ${product.name} estiver disponível novamente.`;
    }
  };

  const isAvailable = product.status === 'available';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl text-foreground">
            {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Product Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">Sem imagem</span>
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <Badge 
                variant={isAvailable ? "default" : "destructive"}
                className={`font-montserrat font-semibold ${
                  isAvailable 
                    ? "bg-green-500 text-white" 
                    : "bg-red-500 text-white"
                }`}
              >
                {isAvailable ? "Disponível" : "Alugado"}
              </Badge>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            {/* Category */}
            <div>
              <span className="font-montserrat text-sm text-muted-foreground">
                Categoria: <span className="font-semibold">{product.category?.name}</span>
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h4 className="font-montserrat font-semibold text-foreground mb-2">Descrição</h4>
                <p className="font-montserrat text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Measurements */}
            {product.measurements && (
              <div>
                <h4 className="font-montserrat font-semibold text-foreground mb-2">Medidas</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(product.measurements).map(([key, value]) => (
                    <div key={key} className="flex justify-between bg-muted rounded-lg p-3">
                      <span className="font-montserrat font-medium capitalize">{key}:</span>
                      <span className="font-montserrat text-muted-foreground">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons - Contact Channels */}
          <div className="pt-6 border-t">
            <div className="text-center mb-4">
              <p className="font-montserrat text-muted-foreground text-sm">
                {isAvailable ? "Entre em contato para alugar:" : "Entre em contato para ser avisado:"}
              </p>
            </div>
            <ContactChannels 
              productName={product.name}
              message={getContactMessage()}
              size="md"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;