import { useState } from "react";
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: number;
  name: string;
  description: string;
  pieceCount: number;
}

export default function CategoriesManagement() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  // Mock data - will be replaced with real data from backend
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "Vestidos",
      description: "Vestidos para todas as ocasiões",
      pieceCount: 45,
    },
    {
      id: 2,
      name: "Sociais",
      description: "Peças elegantes para eventos formais",
      pieceCount: 32,
    },
    {
      id: 3,
      name: "Festa",
      description: "Looks especiais para celebrações",
      pieceCount: 28,
    },
    {
      id: 4,
      name: "Frio",
      description: "Peças para clima frio",
      pieceCount: 22,
    },
    {
      id: 5,
      name: "Calor",
      description: "Peças leves para clima quente",
      pieceCount: 18,
    },
  ]);

  const addCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a categoria.",
        variant: "destructive",
      });
      return;
    }

    const newCategory: Category = {
      id: Math.max(...categories.map((c) => c.id)) + 1,
      name: newCategoryName,
      description: newCategoryDescription,
      pieceCount: 0,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setNewCategoryDescription("");
    setIsAddDialogOpen(false);

    toast({
      title: "Categoria adicionada",
      description: `A categoria "${newCategory.name}" foi criada com sucesso.`,
    });
  };

  const deleteCategory = (id: number) => {
    const category = categories.find((c) => c.id === id);
    if (category && category.pieceCount > 0) {
      toast({
        title: "Não é possível excluir",
        description:
          "Esta categoria possui peças cadastradas. Remova as peças primeiro.",
        variant: "destructive",
      });
      return;
    }

    setCategories(categories.filter((c) => c.id !== id));
    toast({
      title: "Categoria removida",
      description: `A categoria "${category?.name}" foi removida.`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Gestão de Categorias
          </h1>
          <p className="text-muted-foreground font-body mt-2">
            Organize suas peças em categorias
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-gold hover:opacity-90 font-body font-semibold">
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-display">
                Adicionar Categoria
              </DialogTitle>
              <DialogDescription className="font-body">
                Crie uma nova categoria para organizar suas peças.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-body font-medium">
                  Nome da Categoria
                </Label>
                <Input
                  id="name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Ex: Vestidos de Gala"
                  className="font-body"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="font-body font-medium">
                  Descrição (opcional)
                </Label>
                <Input
                  id="description"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="Breve descrição da categoria"
                  className="font-body"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="font-body"
              >
                Cancelar
              </Button>
              <Button
                onClick={addCategory}
                className="gradient-gold hover:opacity-90 font-body font-semibold"
              >
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="shadow-card border-0 hover:shadow-gold transition-shadow duration-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FolderOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-lg">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="font-body text-sm">
                      {category.pieceCount} peças
                    </CardDescription>
                  </div>
                </div>

                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCategory(category.id)}
                    className="hover:bg-destructive/10 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {category.description && (
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground font-body">
                  {category.description}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <Card className="shadow-card border-0">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-display text-lg font-semibold mb-2">
              Nenhuma categoria encontrada
            </h3>
            <p className="text-muted-foreground font-body text-center mb-4">
              Comece criando sua primeira categoria para organizar as peças.
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="gradient-gold hover:opacity-90 font-body font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Categoria
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
