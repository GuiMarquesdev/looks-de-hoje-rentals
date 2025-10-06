import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Plus, X, Upload, Eye, GripVertical } from 'lucide-react';
import { ImageFramingTool } from '@/components/admin/ImageFramingTool';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  image_fit?: 'cover' | 'contain' | 'fill' | 'none';
  image_position?: string;
  image_position_x?: number; // 0-100 percentage
  image_position_y?: number; // 0-100 percentage
  image_zoom?: number; // 100-200 percentage
}
const HeroManagement = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  useEffect(() => {
    fetchHeroSettings();
  }, []);
  const fetchHeroSettings = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('hero_settings').select('*').maybeSingle();
      if (error) throw error;
      if (data && data.slides && Array.isArray(data.slides)) {
        setSlides(data.slides as unknown as HeroSlide[]);
      }
    } catch (error) {
      console.error('Erro ao buscar configurações do hero:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações do hero",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const saveHeroSettings = async () => {
    setSaving(true);
    try {
      // First try to get existing record
      const {
        data: existingData
      } = await supabase.from('hero_settings').select('id').maybeSingle();
      if (existingData?.id) {
        // Update existing record
        const {
          error
        } = await supabase.from('hero_settings').update({
          slides: slides as any
        }).eq('id', existingData.id);
        if (error) throw error;
      } else {
        // Insert new record
        const {
          error
        } = await supabase.from('hero_settings').insert({
          slides: slides as any
        });
        if (error) throw error;
      }
      toast({
        title: "Sucesso",
        description: "Alterações aplicadas com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar alterações",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  const handleSlideUpdate = (index: number, field: keyof HeroSlide, value: string) => {
    const updatedSlides = slides.map((slide, i) => {
      if (i === index) {
        // Handle numeric fields
        if (field === 'image_position_x' || field === 'image_position_y' || field === 'image_zoom') {
          return {
            ...slide,
            [field]: parseFloat(value)
          };
        }
        return {
          ...slide,
          [field]: value
        };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };
  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      title: 'Novo Título',
      subtitle: 'Nova descrição',
      image_url: '',
      image_fit: 'cover',
      image_position: 'center',
      image_position_x: 50,
      image_position_y: 50,
      image_zoom: 100
    };
    setSlides([...slides, newSlide]);
  };
  const removeSlide = (index: number) => {
    const updatedSlides = slides.filter((_, i) => i !== index);
    setSlides(updatedSlides);
  };
  const moveSlide = (fromIndex: number, toIndex: number) => {
    const newSlides = [...slides];
    const [movedSlide] = newSlides.splice(fromIndex, 1);
    newSlides.splice(toIndex, 0, movedSlide);
    setSlides(newSlides);
  };
  const uploadImage = async (file: File, slideIndex: number) => {
    if (!file) return;

    // Validação de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Erro",
        description: "Formato de arquivo não suportado. Use JPG, PNG ou WEBP.",
        variant: "destructive"
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      toast({
        title: "Erro",
        description: "Arquivo muito grande. Máximo 5MB.",
        variant: "destructive"
      });
      return;
    }
    setUploadingIndex(slideIndex);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;
      const {
        data,
        error
      } = await supabase.storage.from('hero-images').upload(fileName, file);
      if (error) throw error;
      const {
        data: publicUrlData
      } = supabase.storage.from('hero-images').getPublicUrl(data.path);
      handleSlideUpdate(slideIndex, 'image_url', publicUrlData.publicUrl);
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!"
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar imagem",
        variant: "destructive"
      });
    } finally {
      setUploadingIndex(null);
    }
  };
  if (loading) {
    return <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>;
  }
  return <div className="p-6 space-y-6 font-montserrat">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-playfair">Gerenciar Vitrine da Loja</h1>
          <p className="text-muted-foreground">
            Gerencie os textos e imagens do carrossel principal do site
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addSlide} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Slide
          </Button>
          <Button onClick={saveHeroSettings} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {slides.map((slide, index) => <Card key={slide.id} className="luxury-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                <CardTitle className="text-lg">Slide {index + 1}</CardTitle>
              </div>
              <div className="flex gap-2">
                {index > 0 && <Button variant="outline" size="sm" onClick={() => moveSlide(index, index - 1)}>
                    ↑
                  </Button>}
                {index < slides.length - 1 && <Button variant="outline" size="sm" onClick={() => moveSlide(index, index + 1)}>
                    ↓
                  </Button>}
                <Button variant="destructive" size="sm" onClick={() => removeSlide(index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`title-${index}`}>Título Principal</Label>
                  <Input id={`title-${index}`} value={slide.title} onChange={e => handleSlideUpdate(index, 'title', e.target.value)} placeholder="Digite o título..." />
                </div>
                <div>
                  <Label htmlFor={`subtitle-${index}`}>Subtítulo</Label>
                  <Textarea id={`subtitle-${index}`} value={slide.subtitle} onChange={e => handleSlideUpdate(index, 'subtitle', e.target.value)} placeholder="Digite o subtítulo..." rows={3} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`image-fit-${index}`}>Ajuste da Imagem</Label>
                    <Select 
                      value={slide.image_fit || 'cover'} 
                      onValueChange={(value) => handleSlideUpdate(index, 'image_fit' as keyof HeroSlide, value)}
                    >
                      <SelectTrigger id={`image-fit-${index}`}>
                        <SelectValue placeholder="Selecione o ajuste" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cover">Cobrir (Cover)</SelectItem>
                        <SelectItem value="contain">Conter (Contain)</SelectItem>
                        <SelectItem value="fill">Preencher (Fill)</SelectItem>
                        <SelectItem value="none">Original (None)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`image-position-${index}`}>Posição da Imagem</Label>
                    <Select 
                      value={slide.image_position || 'center'} 
                      onValueChange={(value) => handleSlideUpdate(index, 'image_position' as keyof HeroSlide, value)}
                    >
                      <SelectTrigger id={`image-position-${index}`}>
                        <SelectValue placeholder="Selecione a posição" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">Centro</SelectItem>
                        <SelectItem value="top">Topo</SelectItem>
                        <SelectItem value="bottom">Baixo</SelectItem>
                        <SelectItem value="left">Esquerda</SelectItem>
                        <SelectItem value="right">Direita</SelectItem>
                        <SelectItem value="top left">Topo Esquerda</SelectItem>
                        <SelectItem value="top right">Topo Direita</SelectItem>
                        <SelectItem value="bottom left">Baixo Esquerda</SelectItem>
                        <SelectItem value="bottom right">Baixo Direita</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Imagem</Label>
                  <div className="flex gap-2">
                    <Input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file, index);
                }} disabled={uploadingIndex === index} />
                    {uploadingIndex === index && <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      </div>}
                  </div>
                </div>
                
                {/* Ferramenta de enquadramento interativo */}
                <div>
                  {slide.image_url ? (
                    <ImageFramingTool
                      imageUrl={slide.image_url}
                      positionX={slide.image_position_x ?? 50}
                      positionY={slide.image_position_y ?? 50}
                      zoom={slide.image_zoom ?? 100}
                      onPositionChange={(x, y) => {
                        handleSlideUpdate(index, 'image_position_x' as keyof HeroSlide, String(x));
                        handleSlideUpdate(index, 'image_position_y' as keyof HeroSlide, String(y));
                      }}
                      onZoomChange={(zoom) => {
                        handleSlideUpdate(index, 'image_zoom' as keyof HeroSlide, String(zoom));
                      }}
                      title={slide.title}
                      subtitle={slide.subtitle}
                    />
                  ) : (
                    <div>
                      <Label>Preview em Tempo Real</Label>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mt-2">
                        <div className="text-center text-muted-foreground">
                          <Upload className="w-8 h-8 mx-auto mb-2" />
                          <p>Nenhuma imagem selecionada</p>
                          <p className="text-xs mt-1">Faça upload de uma imagem para usar a ferramenta de enquadramento</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>

      {slides.length === 0 && <Card className="p-12 text-center">
          <div className="text-muted-foreground">
            <Eye className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum slide configurado</h3>
            <p className="mb-4">Adicione slides para configurar o HeroSection</p>
            <Button onClick={addSlide}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Slide
            </Button>
          </div>
        </Card>}
    </div>;
};
export default HeroManagement;