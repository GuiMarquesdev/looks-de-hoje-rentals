import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminStatsCard } from '@/components/admin/AdminStatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Package, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface Stats {
  total: number;
  available: number;
  rented: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ total: 0, available: 0, rented: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: pieces, error } = await supabase
        .from('pieces')
        .select('status');

      if (error) throw error;

      const total = pieces?.length || 0;
      const available = pieces?.filter(p => p.status === 'available').length || 0;
      const rented = pieces?.filter(p => p.status === 'rented').length || 0;

      setStats({ total, available, rented });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Disponíveis', value: stats.available, color: '#22c55e' },
    { name: 'Alugadas', value: stats.rented, color: '#ef4444' },
  ];

  const availabilityPercentage = stats.total > 0 ? (stats.available / stats.total) * 100 : 0;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-playfair font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground font-montserrat">
          Visão geral do seu catálogo LooksdeHoje
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard
          title="Total de Peças"
          value={stats.total}
          icon={<Package className="w-4 h-4" />}
        />
        <AdminStatsCard
          title="Peças Disponíveis"
          value={stats.available}
          icon={<CheckCircle className="w-4 h-4" />}
        />
        <AdminStatsCard
          title="Peças Alugadas"
          value={stats.rented}
          icon={<Clock className="w-4 h-4" />}
        />
        <AdminStatsCard
          title="Taxa de Ocupação"
          value={Math.round((stats.rented / (stats.total || 1)) * 100)}
          icon={<BarChart3 className="w-4 h-4" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Availability Progress */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="font-playfair">Status das Peças</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-montserrat mb-2">
                <span>Disponibilidade</span>
                <span>{Math.round(availabilityPercentage)}%</span>
              </div>
              <Progress value={availabilityPercentage} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm font-montserrat">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.available}</div>
                <div className="text-green-700">Disponíveis</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.rented}</div>
                <div className="text-red-700">Alugadas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="font-playfair">Distribuição do Catálogo</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.total > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground font-montserrat">
                Nenhuma peça cadastrada ainda
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="font-playfair">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-montserrat">
            <div className="p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <Package className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold">Adicionar Peça</h3>
              <p className="text-sm text-muted-foreground">Cadastre uma nova peça no catálogo</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold">Alterar Status</h3>
              <p className="text-sm text-muted-foreground">Marque peças como disponível/alugada</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <BarChart3 className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold">Ver Relatórios</h3>
              <p className="text-sm text-muted-foreground">Acompanhe o desempenho das peças</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;