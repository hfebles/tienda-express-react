
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerDni, setRegisterDni] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        navigate(redirectUrl);
      }
    } finally {
      setLoginLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple form validation
    if (!registerName || !registerEmail || !registerDni || !registerPhone || !registerPassword) {
      toast.error("Todos los campos son obligatorios");
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (registerPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    setRegisterLoading(true);
    
    try {
      const success = await register(
        {
          name: registerName,
          email: registerEmail,
          dni: registerDni,
          phone: registerPhone
        },
        registerPassword
      );
      
      if (success) {
        navigate(redirectUrl);
      }
    } finally {
      setRegisterLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-brand-primary mr-2" />
            <span className="text-2xl font-bold">TiendaExpress</span>
          </div>
        </div>
        
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>
          
          {/* Login Form */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Iniciar Sesión</CardTitle>
                <CardDescription>
                  Ingresa tus credenciales para acceder a tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tu@email.com"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="login-password">Contraseña</Label>
                      <Input
                        id="login-password"
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" disabled={loginLoading}>
                      {loginLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between flex-wrap">
                <Button variant="link" className="px-0" asChild>
                  <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Register Form */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Crea tu cuenta</CardTitle>
                <CardDescription>
                  Regístrate para comenzar a comprar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="register-name">Nombre completo</Label>
                      <Input
                        id="register-name"
                        type="text"
                        required
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="tu@email.com"
                        required
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="register-dni">DNI</Label>
                        <Input
                          id="register-dni"
                          type="text"
                          required
                          value={registerDni}
                          onChange={(e) => setRegisterDni(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="register-phone">Teléfono</Label>
                        <Input
                          id="register-phone"
                          type="text"
                          required
                          value={registerPhone}
                          onChange={(e) => setRegisterPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="register-password">Contraseña</Label>
                      <Input
                        id="register-password"
                        type="password"
                        required
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="register-confirm-password">Confirmar Contraseña</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        required
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" disabled={registerLoading}>
                      {registerLoading ? "Creando cuenta..." : "Registrarse"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">
                  Al registrarte, aceptas nuestros 
                  <Link to="/terminos" className="text-brand-primary mx-1">
                    Términos y Condiciones
                  </Link>
                  y
                  <Link to="/privacidad" className="text-brand-primary ml-1">
                    Política de Privacidad
                  </Link>.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
