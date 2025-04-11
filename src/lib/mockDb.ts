
import { User } from "../types";
import { toast } from "sonner";
import bcrypt from 'bcryptjs';

// Initial data to simulate a database
const initialData = {
  users: [
    {
      id: "1",
      email: "admin@example.com",
      password: "$2a$10$FQXeGWQvP09pYTUwa5UrGOj/vZ0PuIEbD5NiPnrZP055xCe3/NU42", // hashed version of 'admin123'
      dni: "12345678",
      phone: "+58123456789",
      name: "Administrador",
      address: "Calle Principal 123",
      city: "Caracas",
      isAdmin: true,
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      email: "cliente@example.com",
      password: "$2a$10$ANnKl2/2cMEIJ7U5Ffviou22nBDYMqeJ/amkEQKWNPQ30MoiG4j4C", // hashed version of 'cliente123'
      dni: "87654321", 
      phone: "+58987654321",
      name: "Cliente Demo",
      address: "Avenida Libertador 456",
      city: "Valencia",
      isAdmin: false,
      createdAt: new Date().toISOString()
    }
  ]
};

// Initialize local storage with mock data if it doesn't exist
const initLocalStorage = () => {
  if (!localStorage.getItem('mockDb')) {
    localStorage.setItem('mockDb', JSON.stringify(initialData));
  }
};

// Get data from localStorage
const getCollection = <T>(collectionName: 'users'): T[] => {
  initLocalStorage();
  const db = JSON.parse(localStorage.getItem('mockDb') || '{}');
  return db[collectionName] || [];
};

// Save data to localStorage
const saveCollection = <T>(collectionName: 'users', data: T[]): void => {
  initLocalStorage();
  const db = JSON.parse(localStorage.getItem('mockDb') || '{}');
  db[collectionName] = data;
  localStorage.setItem('mockDb', JSON.stringify(db));
};

export async function query<T>(sql: string, params?: any[]): Promise<T> {
  // This is a mock function that simulates SQL queries with very basic functionality
  try {
    if (sql.toLowerCase().includes('select * from users where email =')) {
      const email = params ? params[0] : null;
      const users = getCollection<User & { password: string }>('users');
      const filteredUsers = users.filter(user => user.email === email);
      return filteredUsers as unknown as T;
    } 
    else if (sql.toLowerCase().includes('select * from users where id =')) {
      const id = params ? params[0] : null;
      const users = getCollection<User>('users');
      const filteredUsers = users.filter(user => user.id === id);
      return filteredUsers as unknown as T;
    }
    else if (sql.toLowerCase().includes('insert into users')) {
      const users = getCollection<User & { password: string }>('users');
      const newId = (parseInt(users[users.length - 1]?.id || "0") + 1).toString();
      
      if (params && params.length >= 8) {
        const newUser: User & { password: string; createdAt: string } = {
          id: newId,
          email: params[0],
          password: params[1],
          dni: params[2],
          phone: params[3],
          name: params[4],
          address: params[5] || "",
          city: params[6] || "",
          isAdmin: params[7] || false,
          createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        saveCollection('users', users);
        
        return { insertId: newId } as unknown as T;
      }
    }
    else if (sql.toLowerCase().includes('update users')) {
      if (params && params.length >= 7) {
        const userId = params[6];
        const users = getCollection<User & { password: string }>('users');
        const updatedUsers = users.map(user => {
          if (user.id === userId) {
            return {
              ...user,
              name: params[0] || user.name,
              email: params[1] || user.email,
              phone: params[2] || user.phone,
              dni: params[3] || user.dni,
              address: params[4] || user.address,
              city: params[5] || user.city,
            };
          }
          return user;
        });
        
        saveCollection('users', updatedUsers);
        return [] as unknown as T;
      }
    }
    
    return [] as unknown as T;
  } catch (error) {
    console.error('Error in mock database query:', error);
    toast.error("Error en la base de datos");
    throw error;
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    initLocalStorage();
    console.log('Mock DB connection successful');
    return true;
  } catch (error) {
    console.error('Mock DB connection error:', error);
    return false;
  }
}
