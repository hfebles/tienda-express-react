
export interface User {
  id: string;
  email: string;
  dni: string;
  phone: string;
  name: string;
  address?: string;
  city?: string;
  isAdmin?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  color: string;
  price: number;
  stock: number;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  categoryId: string;
  category?: Category;
  tags?: Tag[];
  variants: ProductVariant[];
  featuredImage?: string;
  createdAt: Date;
  views: number;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface PaymentMethod {
  id: string;
  type: 'pago_movil' | 'transferencia';
  bank: string;
  accountNumber?: string;
  phone?: string;
  dni: string;
  holderName?: string;
  accountType?: 'ahorro' | 'corriente';
}

export interface PaymentReference {
  id: string;
  orderId: string;
  paymentMethodId: string;
  referenceNumber: string;
  bankOrigin: string;
  date: Date;
  imageUrl?: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  paymentMethodId: string;
  paymentReference?: PaymentReference;
  shippingAddress: string;
  shippingCity: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesReport {
  totalSales: number;
  periodSales: number;
  topProducts: {
    productId: string;
    productName: string;
    quantity: number;
    total: number;
  }[];
  periodStart: Date;
  periodEnd: Date;
}

export interface ViewsReport {
  topViewed: {
    productId: string;
    productName: string;
    views: number;
  }[];
  periodStart: Date;
  periodEnd: Date;
}
