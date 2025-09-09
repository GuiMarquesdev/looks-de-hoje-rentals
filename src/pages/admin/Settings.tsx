import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Settings as SettingsIcon, Shield, Store, Link as LinkIcon } from 'lucide-react';

interface StoreSettings {
  id: string;
  store_name: string;
  instagram_url?: string;
  whatsapp_url?: string;
  email?: string;
  admin_password: string;
}

const Settings = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    store_name: '',
    instagram_url: '',
    whatsapp_url: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;

      setSettings(data);
      setFormData({
        store_name: data.store_name || '',
        instagram_url: data.instagram_url || '',
        whatsapp_url: data.whatsapp_url || '',
        email: data.email || '',
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveStoreInfo = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('store_settings')
        .update({
          store_name: formData.store_name,
          instagram_url: formData.instagram_url,
          whatsapp_url: formData.whatsapp_url,
          email: formData.email,
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast.success('Informações da loja atualizadas com sucesso!');
      fetchSettings();
    } catch (error) {
      console.error('Error updating store info:', error);
      toast.error('Erro ao atualizar informações da loja');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!settings) return;

    if (!formData.current_password || !formData.new_password || !formData.confirm_password) {
      toast.error('Preencha todos os campos de senha');
      return;
    }

    if (formData.current_password !== settings.admin_password) {
      toast.error('Senha atual incorreta');
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      toast.error('Nova senha e confirmação não coincidem');
      return;
    }

    if (formData.new_password.length < 6) {
      toast.error('Nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('store_settings')
        .update({ admin_password: formData.new_password })
        .eq('id', settings.id);

      if (error) throw error;

      toast.success('Senha alterada com sucesso!');
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: '',
      }));
      fetchSettings();
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Erro ao alterar senha');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid gap-6">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground font-montserrat">
          Gerencie as configurações da loja e sua conta
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Store Information */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="font-playfair flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              Informações da Loja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="store_name" className="font-montserrat">Nome da Loja</Label>
              <Input
                id="store_name"
                value={formData.store_name}
                onChange={(e) => handleInputChange('store_name', e.target.value)}
                placeholder="LooksdeHoje"
                className="font-montserrat"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="font-montserrat">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contato@looksdehoje.com"
                className="font-montserrat"
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold font-montserrat flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Links Sociais
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="instagram_url" className="font-montserrat">Instagram</Label>
                <Input
                  id="instagram_url"
                  value={formData.instagram_url}
                  onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/looksdehoje"
                  className="font-montserrat"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp_url" className="font-montserrat">WhatsApp</Label>
                <Input
                  id="whatsapp_url"
                  value={formData.whatsapp_url}
                  onChange={(e) => handleInputChange('whatsapp_url', e.target.value)}
                  placeholder="https://wa.me/5511999999999"
                  className="font-montserrat"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={saveStoreInfo}
                disabled={saving}
                className="bg-primary hover:bg-primary-dark font-montserrat"
              >
                {saving ? 'Salvando...' : 'Salvar Informações'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="font-playfair flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_password" className="font-montserrat">Senha Atual</Label>
              <Input
                id="current_password"
                type="password"
                value={formData.current_password}
                onChange={(e) => handleInputChange('current_password', e.target.value)}
                placeholder="Digite sua senha atual"
                className="font-montserrat"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new_password" className="font-montserrat">Nova Senha</Label>
              <Input
                id="new_password"
                type="password"
                value={formData.new_password}
                onChange={(e) => handleInputChange('new_password', e.target.value)}
                placeholder="Digite a nova senha"
                className="font-montserrat"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm_password" className="font-montserrat">Confirmar Nova Senha</Label>
              <Input
                id="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                placeholder="Confirme a nova senha"
                className="font-montserrat"
              />
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={changePassword}
                disabled={saving}
                variant="outline"
                className="font-montserrat"
              >
                {saving ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Configuration */}
        <Card className="luxury-card border-muted">
          <CardHeader>
            <CardTitle className="font-playfair flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-muted-foreground" />
              Configuração Atual
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground font-montserrat space-y-2">
            <p><strong>Senha padrão:</strong> admin123</p>
            <p><strong>Usuário padrão:</strong> admin</p>
            <p className="text-amber-600">
              ⚠️ Recomendamos alterar a senha padrão por segurança
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;