
import { Category, Product, Tag, User, PaymentMethod } from "../types";

// Mock Categories
export const categories: Category[] = [
  { id: "1", name: "Electrónicos", description: "Productos electrónicos", slug: "electronicos" },
  { id: "2", name: "Ropa", description: "Ropa y accesorios", slug: "ropa" },
  { id: "3", name: "Hogar", description: "Artículos para el hogar", slug: "hogar" },
  { id: "4", name: "Deportes", description: "Equipamiento deportivo", slug: "deportes" }
];

// Mock Tags
export const tags: Tag[] = [
  { id: "1", name: "Oferta", slug: "oferta" },
  { id: "2", name: "Nuevo", slug: "nuevo" },
  { id: "3", name: "Tendencia", slug: "tendencia" },
  { id: "4", name: "Popular", slug: "popular" }
];

// Mock Products
export const products: Product[] = [
  {
    id: "1",
    name: "Smartphone XYZ",
    description: "Smartphone de última generación con cámara de alta resolución",
    slug: "smartphone-xyz",
    categoryId: "1",
    tags: [tags[1], tags[3]],
    variants: [
      {
        id: "1-1",
        productId: "1",
        color: "Negro",
        price: 599.99,
        stock: 15,
        images: ["/placeholder.svg", "/placeholder.svg"]
      },
      {
        id: "1-2",
        productId: "1",
        color: "Blanco",
        price: 599.99,
        stock: 10,
        images: ["/placeholder.svg", "/placeholder.svg"]
      }
    ],
    featuredImage: "/placeholder.svg",
    createdAt: new Date(),
    views: 120
  },
  {
    id: "2",
    name: "Camiseta Deportiva",
    description: "Camiseta deportiva de alta calidad",
    slug: "camiseta-deportiva",
    categoryId: "2",
    tags: [tags[0]],
    variants: [
      {
        id: "2-1",
        productId: "2",
        color: "Rojo",
        price: 29.99,
        stock: 50,
        images: ["/placeholder.svg", "/placeholder.svg"]
      },
      {
        id: "2-2",
        productId: "2",
        color: "Azul",
        price: 29.99,
        stock: 45,
        images: ["/placeholder.svg", "/placeholder.svg"]
      }
    ],
    featuredImage: "/placeholder.svg",
    createdAt: new Date(),
    views: 85
  },
  {
    id: "3",
    name: "Silla Ergonómica",
    description: "Silla de oficina ergonómica para largas jornadas de trabajo",
    slug: "silla-ergonomica",
    categoryId: "3",
    tags: [tags[2]],
    variants: [
      {
        id: "3-1",
        productId: "3",
        color: "Negro",
        price: 199.99,
        stock: 8,
        images: ["/placeholder.svg", "/placeholder.svg"]
      }
    ],
    featuredImage: "/placeholder.svg",
    createdAt: new Date(),
    views: 45
  },
  {
    id: "4",
    name: "Balón de Fútbol",
    description: "Balón de fútbol profesional",
    slug: "balon-futbol",
    categoryId: "4",
    tags: [tags[3]],
    variants: [
      {
        id: "4-1",
        productId: "4",
        color: "Blanco/Negro",
        price: 49.99,
        stock: 30,
        images: ["/placeholder.svg", "/placeholder.svg"]
      }
    ],
    featuredImage: "/placeholder.svg",
    createdAt: new Date(),
    views: 60
  }
];

// Mock Users
export const users: User[] = [
  {
    id: "1",
    name: "Usuario Demo",
    email: "usuario@demo.com",
    dni: "12345678",
    phone: "555-1234",
    address: "Calle Principal 123",
    city: "Ciudad Demo",
    isAdmin: false
  },
  {
    id: "2",
    name: "Admin Demo",
    email: "admin@demo.com",
    dni: "87654321",
    phone: "555-4321",
    address: "Av. Central 456",
    city: "Ciudad Admin",
    isAdmin: true
  }
];

// Mock Payment Methods
export const paymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "pago_movil",
    bank: "Banco de Venezuela",
    phone: "555-9876",
    dni: "98765432"
  },
  {
    id: "2",
    type: "transferencia",
    bank: "Banesco",
    accountNumber: "1234567890",
    dni: "87654321",
    holderName: "Tienda Demo",
    accountType: "corriente"
  },
  {
    id: "3",
    type: "transferencia",
    bank: "Mercantil",
    accountNumber: "0987654321",
    dni: "76543210",
    holderName: "Tienda Demo",
    accountType: "ahorro"
  }
];

export const banks = [
  "Banco de Venezuela",
  "Banesco",
  "Mercantil",
  "Provincial"
];
