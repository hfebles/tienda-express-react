
import { User } from "../types";
import { query } from "../lib/db";
import { toast } from "sonner";

export const userService = {
  // Iniciar sesión de usuario
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const users = await query<User[]>(
        'SELECT * FROM users WHERE email = ? LIMIT 1', 
        [email]
      );
      
      if (users && users.length > 0) {
        // En un sistema real, validaríamos la contraseña con bcrypt
        // Por ahora, solo devolvemos el usuario encontrado
        return users[0];
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
      
      // En un sistema real, hashearíamos la contraseña con bcrypt
      const result = await query<any>(
        `INSERT INTO users (email, dni, phone, name, address, city, isAdmin) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.email,
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
          return newUser[0];
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
        return updatedUser[0];
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
        return users[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }
};

