import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroDress1 from "@/assets/hero-dress-1.jpg";
import heroDress2 from "@/assets/hero-dress-2.jpg";
import heroDress3 from "@/assets/hero-dress-3.jpg";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: heroDress1,
      title: "Elegância em Cada Ocasião",
      subtitle: "Alugue looks únicos para momentos especiais"
    },
    {
      image: heroDress2,
      title: "Estilo Sofisticado",
      subtitle: "Descubra a coleção mais exclusiva da cidade"
    },
    {
      image: heroDress3,
      title: "Luxo Acessível",
      subtitle: "Vista-se com elegância sem comprometer o orçamento"
    }
  ];

  // Auto carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const scrollToCollection = () => {
    const element = document.getElementById("colecao");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="relative h-screen overflow-hidden">
      {/* Carousel Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 hero-overlay" />
            
            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
              <div className="max-w-4xl mx-auto animate-fade-in">
                <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="font-montserrat text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  {slide.subtitle}
                </p>
                <Button 
                  onClick={scrollToCollection}
                  size="lg"
                  className="bg-gradient-gold hover:bg-primary-dark text-primary-foreground font-montserrat font-semibold px-8 py-4 rounded-full shadow-gold transition-all duration-300 hover:-translate-y-1 text-lg"
                >
                  Veja Nossa Coleção
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 group"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-primary scale-125 shadow-gold" 
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;