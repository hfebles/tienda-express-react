
import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  CreditCard,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Redirect to login if not admin
  if (!user?.isAdmin) {
    navigate("/login");
    return null;
  }
  
  const navItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", path: "/admin" },
    { icon: <Package className="h-5 w-5" />, label: "Ordenes", path: "/admin/ordenes" },
    { icon: <ShoppingBag className="h-5 w-5" />, label: "Productos", path: "/admin/productos" },
    { icon: <Users className="h-5 w-5" />, label: "Clientes", path: "/admin/clientes" },
    { icon: <BarChart3 className="h-5 w-5" />, label: "Informes", path: "/admin/informes" },
    { icon: <CreditCard className="h-5 w-5" />, label: "Métodos de Pago", path: "/admin/pagos" },
  ];
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <ShoppingBag className="h-6 w-6 text-brand-primary mr-2" />
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 rounded-md transition-colors ${
                  isActive
                    ? "bg-brand-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback className="bg-brand-primary text-white">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>
      
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-200 ease-in-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <ShoppingBag className="h-6 w-6 text-brand-primary mr-2" />
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 rounded-md transition-colors ${
                  isActive
                    ? "bg-brand-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback className="bg-brand-primary text-white">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Breadcrumb */}
          <div className="flex items-center">
            <span className="text-sm text-gray-500">Dashboard</span>
            <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
            <span className="text-sm font-medium">Home</span>
          </div>
          
          {/* User menu (mobile) */}
          <div className="md:hidden">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-brand-primary text-white">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
