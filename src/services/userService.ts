
import { User } from "../types";
import { query } from "../lib/mockDb";
import { toast } from "sonner";
import bcrypt from 'bcryptjs';

export const userService = {
  // Iniciar sesión de usuario
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const users = await query<(User & { password: string })[]>(
        'SELECT * FROM users WHERE email = ? LIMIT 1', 
        [email]
      );
      
      if (users && users.length > 0) {
        const user = users[0];
        // Comparar contraseñas hasheadas
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (isPasswordValid) {
          // Eliminamos la contraseña antes de devolver el usuario
          const { password: _, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }
      }
      return null;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error("Error al iniciar sesión");
      return null;
    }
  },

  // Registrar nuevo usuario
  register: async (userData: Partial<User>, password: string): Promise<User | null> => {
    try {
      // Verificar si el email ya existe
      const existingUsers = await query<User[]>(
        'SELECT * FROM users WHERE email = ? LIMIT 1',
        [userData.email]
      );
      
      if (existingUsers && existingUsers.length > 0) {
        toast.error("El email ya está registrado");
        return null;
      }
      
      // Hash de la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const result = await query<any>(
        `INSERT INTO users (email, password, dni, phone, name, address, city, isAdmin) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.email,
          hashedPassword,
          userData.dni,
          userData.phone,
          userData.name,
          userData.address || "",
          userData.city || "",
          userData.isAdmin || false
        ]
      );
      
      if (result && result.insertId) {
        // Obtener el usuario recién creado
        const newUser = await query<User[]>(
          'SELECT * FROM users WHERE id = ? LIMIT 1',
          [result.insertId]
        );
        
        if (newUser && newUser.length > 0) {
          // Ensure we don't return the password
          const { password: _, ...userWithoutPassword } = newUser[0] as any;
          return userWithoutPassword;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      toast.error("Error al registrarse");
      return null;
    }
  },

  // Actualizar perfil de usuario
  updateProfile: async (userId: string, userData: Partial<User>): Promise<User | null> => {
    try {
      await query(
        `UPDATE users 
         SET name = ?, email = ?, phone = ?, dni = ?, address = ?, city = ? 
         WHERE id = ?`,
        [
          userData.name,
          userData.email,
          userData.phone,
          userData.dni,
          userData.address,
          userData.city,
          userId
        ]
      );
      
      // Obtener el usuario actualizado
      const updatedUser = await query<User[]>(
        'SELECT * FROM users WHERE id = ? LIMIT 1',
        [userId]
      );
      
      if (updatedUser && updatedUser.length > 0) {
        // Ensure we don't return the password
        const { password: _, ...userWithoutPassword } = updatedUser[0] as any;
        return userWithoutPassword;
      }
      
      return null;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error("Error al actualizar perfil");
      return null;
    }
  },

  // Obtener usuario por ID
  getUserById: async (userId: string): Promise<User | null> => {
    try {
      const users = await query<User[]>(
        'SELECT * FROM users WHERE id = ? LIMIT 1',
        [userId]
      );
      
      if (users && users.length > 0) {
        // Ensure we don't return the password
        const { password: _, ...userWithoutPassword } = users[0] as any;
        return userWithoutPassword;
      }
      
      return null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  },
  
  // Cambiar contraseña de usuario
  changePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // Primero verificamos que la contraseña actual sea correcta
      const users = await query<(User & { password: string })[]>(
        'SELECT * FROM users WHERE id = ? LIMIT 1',
        [userId]
      );
      
      if (!users || users.length === 0) {
        toast.error("Usuario no encontrado");
        return false;
      }
      
      const user = users[0];
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        toast.error("La contraseña actual no es correcta");
        return false;
      }
      
      // La contraseña actual es correcta, actualizamos a la nueva
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      
      // Actualizamos en nuestra "base de datos"
      const allUsers = await query<(User & { password: string })[]>(
        'SELECT * FROM users', []
      );
      
      const updatedUsers = allUsers.map(u => {
        if (u.id === userId) {
          return { ...u, password: hashedNewPassword };
        }
        return u;
      });
      
      // Esta es una simulación de actualizar la contraseña en la base de datos
      // En un sistema real, usaríamos una consulta UPDATE
      localStorage.setItem('mockDb', JSON.stringify({ users: updatedUsers }));
      
      toast.success("Contraseña actualizada correctamente");
      return true;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      toast.error("Error al cambiar la contraseña");
      return false;
    }
  }
};
