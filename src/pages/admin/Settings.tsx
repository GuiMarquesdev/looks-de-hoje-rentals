import { useState } from "react";
import {
  Save,
  Eye,
  EyeOff,
  Instagram,
  MessageCircle,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Admin credentials
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",

    // Store information
    storeName: "LooksdeHoje",
    instagram: "@looksdeHoje",
    whatsapp: "+55 (11) 99999-9999",
    email: "contato@looksdeHoje.com.br",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = () => {
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos de senha.",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "A nova senha e a confirmação devem ser iguais.",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Senha muito fraca",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    // Reset form
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));

    toast({
      title: "Senha alterada",
      description: "Sua senha foi alterada com sucesso.",
    });
  };

  const handleStoreInfoSave = () => {
    toast({
      title: "Informações salvas",
      description: "As informações da loja foram atualizadas.",
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Configurações
        </h1>
        <p className="text-muted-foreground font-body mt-2">
          Gerencie as configurações do seu painel administrativo
        </p>
      </div>

      {/* Security Settings */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="font-display">Segurança</CardTitle>
          <CardDescription className="font-body">
            Altere sua senha de acesso ao painel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 max-w-md">
            <div className="space-y-2">
              <Label
                htmlFor="current-password"
                className="font-body font-medium"
              >
                Senha Atual
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    handleInputChange("currentPassword", e.target.value)
                  }
                  className="font-body pr-10"
                  placeholder="Digite sua senha atual"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password" className="font-body font-medium">
                Nova Senha
              </Label>
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                className="font-body"
                placeholder="Digite a nova senha"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="font-body font-medium"
              >
                Confirmar Nova Senha
              </Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="font-body"
                placeholder="Confirme a nova senha"
              />
            </div>
          </div>

          <Button
            onClick={handlePasswordChange}
            className="gradient-gold hover:opacity-90 font-body font-semibold"
          >
            <Save className="h-4 w-4 mr-2" />
            Alterar Senha
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Store Information */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="font-display">Informações da Loja</CardTitle>
          <CardDescription className="font-body">
            Configure os dados de contato da LooksdeHoje
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="store-name" className="font-body font-medium">
                Nome da Loja
              </Label>
              <Input
                id="store-name"
                value={formData.storeName}
                onChange={(e) => handleInputChange("storeName", e.target.value)}
                className="font-body"
                placeholder="Nome da sua loja"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-body font-medium">
                E-mail de Contato
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="font-body pl-10"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="font-body font-medium">
                Instagram
              </Label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) =>
                    handleInputChange("instagram", e.target.value)
                  }
                  className="font-body pl-10"
                  placeholder="@seuinstagram"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="font-body font-medium">
                WhatsApp
              </Label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    handleInputChange("whatsapp", e.target.value)
                  }
                  className="font-body pl-10"
                  placeholder="+55 (11) 99999-9999"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleStoreInfoSave}
            className="gradient-gold hover:opacity-90 font-body font-semibold"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Informações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
