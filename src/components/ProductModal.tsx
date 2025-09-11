import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X } from 'lucide-react';

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

  const whatsappRent = (productName: string) => {
    const message = `Olá! Gostaria de alugar o ${productName} do LooksdeHoje. Poderia me dar mais informações?`;
    window.open(`https://wa.me/${whatsappUrl}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const whatsappNotify = (productName: string) => {
    const message = `Olá, gostaria de ser avisado(a) quando a peça ${productName} estiver disponível novamente.`;
    window.open(`https://wa.me/${whatsappUrl}?text=${encodeURIComponent(message)}`, "_blank");
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

          {/* Action Button */}
          <div className="flex justify-center pt-4 border-t">
            <Button
              onClick={() => isAvailable ? whatsappRent(product.name) : whatsappNotify(product.name)}
              className={`font-montserrat font-semibold px-8 py-3 rounded-full shadow-gold transition-all duration-300 ${
                isAvailable 
                  ? "bg-gradient-gold hover:bg-primary-dark text-primary-foreground" 
                  : "bg-yellow-400 hover:bg-black text-black hover:text-yellow-400 border border-yellow-400"
              }`}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {isAvailable ? "Alugar pelo WhatsApp" : "Me avise quando estiver disponível"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;