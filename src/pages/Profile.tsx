
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { LogOut, User } from "lucide-react";
import { userService } from "@/services/userService";

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  // If user is not logged in, redirect to login
  if (!user) {
    navigate("/login");
    return null;
  }
  
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    dni: user.dni || "",
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await updateProfile(formData);
      if (success) {
        toast.success("Perfil actualizado con éxito");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Todos los campos son obligatorios");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    setIsPasswordLoading(true);
    
    try {
      const success = await userService.changePassword(
        user.id,
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (success) {
        // Limpiar el formulario
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        toast.success("Contraseña actualizada correctamente");
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Mi Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div>
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-xl bg-brand-primary text-white">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-semibold text-xl">{user.name}</h2>
              <p className="text-sm text-gray-500 mb-6">{user.email}</p>
              
              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-3">
          <Tabs defaultValue="personal">
            <TabsList className="mb-6">
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
              <TabsTrigger value="address">Dirección</TabsTrigger>
              <TabsTrigger value="security">Seguridad</TabsTrigger>
            </TabsList>
            
            {/* Personal Information */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Actualiza tu información personal aquí
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dni">DNI</Label>
                        <Input
                          id="dni"
                          name="dni"
                          value={formData.dni}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Address */}
            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle>Dirección de Envío</CardTitle>
                  <CardDescription>
                    Actualiza tu dirección de envío preferida
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <div>
                        <Label htmlFor="address">Dirección</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Security */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Seguridad</CardTitle>
                  <CardDescription>
                    Gestiona tu contraseña y la seguridad de tu cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword}>
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <div>
                        <Label htmlFor="currentPassword">Contraseña Actual</Label>
                        <Input 
                          id="currentPassword" 
                          name="currentPassword"
                          type="password" 
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">Nueva Contraseña</Label>
                        <Input 
                          id="newPassword" 
                          name="newPassword"
                          type="password" 
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                        <Input 
                          id="confirmPassword" 
                          name="confirmPassword"
                          type="password" 
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required 
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={isPasswordLoading}>
                      {isPasswordLoading ? "Cambiando..." : "Cambiar Contraseña"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
