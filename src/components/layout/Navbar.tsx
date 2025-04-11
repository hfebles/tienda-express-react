
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  User,
  Menu,
  Search,
  LogIn,
  LogOut,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center">
          <ShoppingBag className="h-6 w-6 text-brand-primary mr-2" />
          <span className="text-xl font-bold">TiendaExpress</span>
        </Link>

        {/* Search bar - hidden on small screens */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 mx-4 relative max-w-xl"
        >
          <Input
            type="search"
            placeholder="Buscar productos..."
            className="pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/productos" className="text-sm font-medium hover:text-brand-primary">
            Productos
          </Link>
          <Link to="/categorias" className="text-sm font-medium hover:text-brand-primary">
            Categorías
          </Link>
          
          {/* Cart button */}
          <Link to="/carrito" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 px-1.5 bg-brand-primary">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="font-medium">
                  Hola, {user.name.split(" ")[0]}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/perfil")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/pedidos")}>
                  <Package className="mr-2 h-4 w-4" />
                  <span>Mis Pedidos</span>
                </DropdownMenuItem>
                {user.isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>Panel Admin</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="secondary"
              onClick={() => navigate("/login")}
              className="flex items-center"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Ingresar
            </Button>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center md:hidden gap-2">
          <Link to="/carrito" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 px-1.5 bg-brand-primary">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="px-4 py-3 border-b md:hidden bg-muted/50">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="mb-4 flex">
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="mr-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="space-y-3">
            <Link
              to="/productos"
              className="block text-sm font-medium hover:text-brand-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Productos
            </Link>
            <Link
              to="/categorias"
              className="block text-sm font-medium hover:text-brand-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categorías
            </Link>
            {user ? (
              <>
                <Link
                  to="/perfil"
                  className="block text-sm font-medium hover:text-brand-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mi Perfil
                </Link>
                <Link
                  to="/pedidos"
                  className="block text-sm font-medium hover:text-brand-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mis Pedidos
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="block text-sm font-medium hover:text-brand-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Panel Admin
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start p-0 hover:bg-transparent"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Cerrar Sesión</span>
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
                className="w-full"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Ingresar
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
