import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "../types";
import { users } from "../lib/data";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - would connect to MySQL
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find user by email (in a real app, would validate password too)
      const foundUser = users.find(u => u.email === email);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));
        toast.success("Inicio de sesión exitoso");
        return true;
      } else {
        toast.error("Credenciales inválidas");
        return false;
      }
    } catch (error) {
      toast.error("Error al iniciar sesión");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    // Mock registration - would connect to MySQL
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if email already exists
      const existingUser = users.find(u => u.email === userData.email);
      
      if (existingUser) {
        toast.error("El email ya está registrado");
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: String(users.length + 1),
        email: userData.email!,
        dni: userData.dni!,
        phone: userData.phone!,
        name: userData.name!,
        address: userData.address || "",
        city: userData.city || "",
        isAdmin: false
      };
      
      // In a real app, this would be a database insert
      users.push(newUser);
      
      // Auto login
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      toast.success("Registro exitoso");
      return true;
    } catch (error) {
      toast.error("Error al registrarse");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Sesión cerrada");
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update user data
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // In a real app, this would update the database
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
      }
      
      toast.success("Perfil actualizado");
      return true;
    } catch (error) {
      toast.error("Error al actualizar perfil");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
