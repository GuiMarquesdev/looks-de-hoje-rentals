import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Piece {
  id: number;
  name: string;
  category: string;
  status: "available" | "rented";
  image?: string;
}

export default function PiecesManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - will be replaced with real data from backend
  const [pieces, setPieces] = useState<Piece[]>([
    {
      id: 1,
      name: "Vestido Azul Marinho",
      category: "Vestidos",
      status: "rented",
    },
    { id: 2, name: "Blazer Dourado", category: "Sociais", status: "available" },
    { id: 3, name: "Saia Plissada", category: "Festa", status: "available" },
    { id: 4, name: "Casaco de Inverno", category: "Frio", status: "rented" },
    { id: 5, name: "Vestido Floral", category: "Calor", status: "available" },
  ]);

  const filteredPieces = pieces.filter(
    (piece) =>
      piece.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      piece.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = (id: number) => {
    setPieces(
      pieces.map((piece) =>
        piece.id === id
          ? {
              ...piece,
              status: piece.status === "available" ? "rented" : "available",
            }
          : piece
      )
    );

    const piece = pieces.find((p) => p.id === id);
    const newStatus = piece?.status === "available" ? "alugada" : "disponível";

    toast({
      title: "Status alterado",
      description: `${piece?.name} agora está ${newStatus}.`,
    });
  };

  const deletePiece = (id: number) => {
    const piece = pieces.find((p) => p.id === id);
    setPieces(pieces.filter((p) => p.id !== id));

    toast({
      title: "Peça removida",
      description: `${piece?.name} foi removida do catálogo.`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Gestão de Peças
          </h1>
          <p className="text-muted-foreground font-body mt-2">
            Gerencie o catálogo da sua loja
          </p>
        </div>

        <Button className="gradient-gold hover:opacity-90 font-body font-semibold">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Peça
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="font-display">Buscar Peças</CardTitle>
          <CardDescription className="font-body">
            Encontre rapidamente qualquer peça do seu catálogo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 font-body"
            />
          </div>{" "}
        </CardContent>
      </Card>

      {/* Pieces Table */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="font-display">
            Catálogo ({filteredPieces.length} peças)
          </CardTitle>
          <CardDescription className="font-body">
            Lista completa das suas peças
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body font-semibold">
                    Nome
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Categoria
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="font-body font-semibold text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPieces.map((piece) => (
                  <TableRow key={piece.id} className="hover:bg-muted/50">
                    <TableCell className="font-body font-medium">
                      {piece.name}
                    </TableCell>
                    <TableCell className="font-body text-muted-foreground">
                      {piece.category}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          piece.status === "available" ? "default" : "secondary"
                        }
                        className={`font-body ${
                          piece.status === "available"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }`}
                      >
                        {piece.status === "available"
                          ? "Disponível"
                          : "Alugada"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStatus(piece.id)}
                          className="hover:bg-primary/10"
                        >
                          {piece.status === "available" ? (
                            <ToggleLeft className="h-4 w-4" />
                          ) : (
                            <ToggleRight className="h-4 w-4" />
                          )}
                        </Button>
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
                          onClick={() => deletePiece(piece.id)}
                          className="hover:bg-destructive/10 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
