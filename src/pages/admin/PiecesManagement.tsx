import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Piece {
  id: string;
  name: string;
  category_id: string;
  category?: { name: string };
  status: "available" | "rented";
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
}

const pieceSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  category_id: z.string().min(1, "Categoria é obrigatória"),
  status: z.enum(["available", "rented"]),
  image: z.any().optional(),
});

const PiecesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPiece, setEditingPiece] = useState<Piece | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof pieceSchema>>({
    resolver: zodResolver(pieceSchema),
    defaultValues: {
      name: "",
      category_id: "",
      status: "available",
    },
  });

  useEffect(() => {
    fetchPieces();
    fetchCategories();
  }, []);

  const fetchPieces = async () => {
    try {
      const { data, error } = await supabase
        .from('pieces')
        .select(`
          *,
          category:categories(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPieces((data || []) as Piece[]);
    } catch (error) {
      console.error('Error fetching pieces:', error);
      toast.error('Erro ao carregar peças');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pieces')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('pieces')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao fazer upload da imagem');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof pieceSchema>) => {
    try {
      let imageUrl = editingPiece?.image_url;

      // Upload image if provided
      if (values.image && values.image[0]) {
        const uploadedUrl = await uploadImage(values.image[0]);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const pieceData = {
        name: values.name,
        category_id: values.category_id,
        status: values.status,
        image_url: imageUrl,
      };

      if (editingPiece) {
        // Update existing piece
        const { error } = await supabase
          .from('pieces')
          .update(pieceData)
          .eq('id', editingPiece.id);

        if (error) throw error;
        toast.success('Peça atualizada com sucesso!');
      } else {
        // Create new piece
        const { error } = await supabase
          .from('pieces')
          .insert([pieceData]);

        if (error) throw error;
        toast.success('Peça adicionada com sucesso!');
      }

      setIsDialogOpen(false);
      setEditingPiece(null);
      form.reset();
      fetchPieces();
    } catch (error) {
      console.error('Error saving piece:', error);
      toast.error('Erro ao salvar peça');
    }
  };

  const toggleStatus = async (piece: Piece) => {
    try {
      const newStatus = piece.status === "available" ? "rented" : "available";
      
      const { error } = await supabase
        .from('pieces')
        .update({ status: newStatus })
        .eq('id', piece.id);

      if (error) throw error;

      const statusText = newStatus === "available" ? "disponível" : "alugada";
      toast.success(`Peça marcada como ${statusText}`);
      fetchPieces();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erro ao alterar status');
    }
  };

  const deletePiece = async (piece: Piece) => {
    try {
      const { error } = await supabase
        .from('pieces')
        .delete()
        .eq('id', piece.id);

      if (error) throw error;

      toast.success(`Peça "${piece.name}" removida do catálogo`);
      fetchPieces();
    } catch (error) {
      console.error('Error deleting piece:', error);
      toast.error('Erro ao excluir peça');
    }
  };

  const openEditDialog = (piece: Piece) => {
    setEditingPiece(piece);
    form.reset({
      name: piece.name,
      category_id: piece.category_id,
      status: piece.status,
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingPiece(null);
    form.reset({
      name: "",
      category_id: "",
      status: "available",
    });
    setIsDialogOpen(true);
  };

  const filteredPieces = pieces.filter(piece =>
    piece.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    piece.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-foreground">Gestão de Peças</h1>
          <p className="text-muted-foreground font-montserrat">
            Gerencie todas as peças do seu catálogo
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="flex items-center gap-2 bg-primary hover:bg-primary-dark font-montserrat">
              <Plus className="w-4 h-4" />
              Adicionar Peça
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-playfair">
                {editingPiece ? 'Editar Peça' : 'Nova Peça'}
              </DialogTitle>
              <DialogDescription className="font-montserrat">
                {editingPiece ? 'Atualize os dados da peça.' : 'Adicione uma nova peça ao catálogo.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-montserrat">Nome da Peça</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome da peça" {...field} className="font-montserrat" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-montserrat">Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="font-montserrat">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id} className="font-montserrat">
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-montserrat">Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="font-montserrat">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available" className="font-montserrat">Disponível</SelectItem>
                          <SelectItem value="rented" className="font-montserrat">Alugada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-montserrat">Imagem</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files)}
                          className="font-montserrat"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="font-montserrat"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={uploading}
                    className="bg-primary hover:bg-primary-dark font-montserrat"
                  >
                    {uploading ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="font-playfair">Catálogo de Peças</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar peças..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm font-montserrat"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-montserrat">Imagem</TableHead>
                <TableHead className="font-montserrat">Nome</TableHead>
                <TableHead className="font-montserrat">Categoria</TableHead>
                <TableHead className="font-montserrat">Status</TableHead>
                <TableHead className="text-right font-montserrat">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPieces.map((piece) => (
                <TableRow key={piece.id}>
                  <TableCell>
                    {piece.image_url ? (
                      <img
                        src={piece.image_url}
                        alt={piece.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium font-montserrat">{piece.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-montserrat">
                      {piece.category?.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={piece.status === "available" ? "default" : "destructive"}
                      className="font-montserrat"
                    >
                      {piece.status === "available" ? "Disponível" : "Alugada"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="font-montserrat">Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEditDialog(piece)} className="font-montserrat">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(piece)} className="font-montserrat">
                          {piece.status === "available" ? (
                            <>
                              <ToggleRight className="mr-2 h-4 w-4" />
                              Marcar como Alugada
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="mr-2 h-4 w-4" />
                              Marcar como Disponível
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => deletePiece(piece)}
                          className="text-destructive font-montserrat"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPieces.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-montserrat">
                    Nenhuma peça encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PiecesManagement;