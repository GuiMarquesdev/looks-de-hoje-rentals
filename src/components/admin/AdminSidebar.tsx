import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Settings, 
  LogOut,
  Image
} from 'lucide-react';
import logoAdmin from '@/assets/logo-admin-circular.png';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { cn } from '@/lib/utils';

const sidebarItems = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Gestão de Peças',
    url: '/admin/pieces',
    icon: Package,
  },
  {
    title: 'Categorias',
    url: '/admin/categories',
    icon: Tags,
  },
  {
    title: 'Gerenciar HeroSection',
    url: '/admin/hero',
    icon: Image,
  },
  {
    title: 'Configurações',
    url: '/admin/settings',
    icon: Settings,
  },
];

const AdminSidebar = () => {
  const { logout } = useAdmin();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/admin';
  };

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img 
              src={logoAdmin} 
              alt="LooksdeHoje Logo" 
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div>
            <h1 className="font-playfair text-lg font-semibold text-foreground">
              LooksdeHoje
            </h1>
            <p className="text-sm text-muted-foreground font-montserrat">
              Administração
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors font-montserrat",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.title}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="sticky bottom-0 p-4 border-t border-border bg-card">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive font-montserrat"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;