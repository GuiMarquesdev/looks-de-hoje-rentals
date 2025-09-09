import { useState } from "react";
import { MessageCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import dressProduct1 from "@/assets/dress-product-1.jpg";
import dressProduct2 from "@/assets/dress-product-2.jpg";
import dressProduct3 from "@/assets/dress-product-3.jpg";

interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  available: boolean;
  price?: string;
}

const CollectionSection = () => {
  const [activeCategory, setActiveCategory] = useState("todos");

  const categories = [
    { id: "todos", name: "Todos", count: 12 },
    { id: "vestidos", name: "Vestidos", count: 5 },
    { id: "sociais", name: "Sociais", count: 3 },
    { id: "festa", name: "Festa", count: 2 },
    { id: "frio", name: "Frio", count: 1 },
    { id: "calor", name: "Calor", count: 1 }
  ];

  const products: Product[] = [
    {
      id: "1",
      name: "Vestido Elegante Preto",
      image: dressProduct1,
      category: "festa",
      available: true
    },
    {
      id: "2",
      name: "Vestido Dourado Cocktail",
      image: dressProduct2,
      category: "festa",
      available: false
    },
    {
      id: "3",
      name: "Vestido Social Branco",
      image: dressProduct3,
      category: "sociais",
      available: true
    },
    {
      id: "4",
      name: "Vestido Midi Floral",
      image: dressProduct1,
      category: "calor",
      available: true
    },
    {
      id: "5",
      name: "Vestido Longo Bordado",
      image: dressProduct2,
      category: "festa",
      available: true
    },
    {
      id: "6",
      name: "Conjunto Social Navy",
      image: dressProduct3,
      category: "sociais",
      available: false
    }
  ];

  const filteredProducts = activeCategory === "todos" 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const whatsappRent = (productName: string) => {
    const message = `Olá! Gostaria de alugar o ${productName} do LooksdeHoje. Poderia me dar mais informações?`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, "_blank");
  };

  const whatsappNotify = (productName: string) => {
    const message = `Olá, gostaria de ser avisado(a) quando a peça ${productName} estiver disponível novamente.`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section id="colecao" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
            Nossa Coleção
          </h2>
          <p className="font-montserrat text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra looks únicos para cada ocasião. Elegância e sofisticação para momentos especiais.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`inline-flex items-center px-6 py-3 rounded-full font-montserrat font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                activeCategory === category.id
                  ? "bg-gradient-gold text-primary-foreground shadow-gold"
                  : "bg-background text-foreground hover:bg-muted border border-border"
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              {category.name}
              <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                activeCategory === category.id
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="luxury-card hover-lift group overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant={product.available ? "default" : "destructive"}
                    className={`font-montserrat font-semibold ${
                      product.available 
                        ? "bg-green-500 text-white" 
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {product.available ? "Disponível" : "Alugado"}
                  </Badge>
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    onClick={() => product.available ? whatsappRent(product.name) : whatsappNotify(product.name)}
                    className={`font-montserrat font-semibold px-6 py-3 rounded-full shadow-gold transition-all duration-300 ${
                      product.available 
                        ? "bg-gradient-gold hover:bg-primary-dark text-primary-foreground" 
                        : "bg-yellow-400 hover:bg-black text-black hover:text-yellow-400 border border-yellow-400"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {product.available ? "Alugar pelo WhatsApp" : "Me avise quando estiver disponível"}
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-playfair text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className="font-montserrat text-sm text-muted-foreground capitalize">
                    {categories.find(c => c.id === product.category)?.name || product.category}
                  </span>
                  
                  <Button
                    size="sm"
                    onClick={() => product.available ? whatsappRent(product.name) : whatsappNotify(product.name)}
                    className={`font-montserrat font-medium px-4 py-2 rounded-full shadow-gold transition-all duration-300 ${
                      product.available 
                        ? "bg-gradient-gold hover:bg-primary-dark text-primary-foreground" 
                        : "bg-yellow-400 hover:bg-black text-black hover:text-yellow-400 border border-yellow-400"
                    }`}
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    {product.available ? "Alugar" : "Me avise"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Button 
            variant="outline"
            size="lg"
            className="font-montserrat font-semibold px-8 py-3 rounded-full border-2 border-primary text-primary hover:bg-gradient-gold hover:text-primary-foreground hover:border-transparent transition-all duration-300"
          >
            Ver Mais Peças
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;