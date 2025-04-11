
import { Order, CartItem, PaymentReference } from "../types";
import { query } from "../lib/db";
import { toast } from "sonner";

export const orderService = {
  // Crear un nuevo pedido
  createOrder: async (
    userId: string, 
    items: CartItem[], 
    total: number,
    paymentMethodId: string,
    shippingAddress: string,
    shippingCity: string
  ): Promise<Order | null> => {
    try {
      // Insertar el pedido en la base de datos
      const result = await query<any>(
        `INSERT INTO orders 
         (userId, total, paymentMethodId, shippingAddress, shippingCity, status, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
        [userId, total, paymentMethodId, shippingAddress, shippingCity]
      );
      
      if (result && result.insertId) {
        const orderId = result.insertId;
        
        // Insertar los items del pedido
        await Promise.all(
          items.map(item => 
            query(
              `INSERT INTO order_items (orderId, productId, variantId, quantity) 
               VALUES (?, ?, ?, ?)`,
              [orderId, item.productId, item.variantId, item.quantity]
            )
          )
        );
        
        // Actualizar el stock de cada variante
        await Promise.all(
          items.map(item => 
            query(
              `UPDATE product_variants 
               SET stock = stock - ? 
               WHERE id = ?`,
              [item.quantity, item.variantId]
            )
          )
        );
        
        // Obtener el pedido creado
        const orders = await query<Order[]>(
          'SELECT * FROM orders WHERE id = ? LIMIT 1',
          [orderId]
        );
        
        if (orders && orders.length > 0) {
          // Obtener los items del pedido
          const orderItems = await query<CartItem[]>(
            `SELECT oi.*, p.*, pv.* 
             FROM order_items oi
             JOIN products p ON oi.productId = p.id
             JOIN product_variants pv ON oi.variantId = pv.id
             WHERE oi.orderId = ?`,
            [orderId]
          );
          
          return {
            ...orders[0],
            items: orderItems,
            createdAt: new Date(orders[0].createdAt),
            updatedAt: new Date(orders[0].updatedAt)
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error al crear pedido:', error);
      toast.error("Error al crear el pedido");
      return null;
    }
  },
  
  // Agregar referencia de pago a un pedido
  addPaymentReference: async (
    orderId: string,
    paymentMethodId: string,
    referenceNumber: string,
    bankOrigin: string,
    date: Date,
    imageUrl?: string
  ): Promise<PaymentReference | null> => {
    try {
      const result = await query<any>(
        `INSERT INTO payment_references 
         (orderId, paymentMethodId, referenceNumber, bankOrigin, date, imageUrl, status) 
         VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [orderId, paymentMethodId, referenceNumber, bankOrigin, date, imageUrl]
      );
      
      if (result && result.insertId) {
        // Obtener la referencia de pago creada
        const refs = await query<PaymentReference[]>(
          'SELECT * FROM payment_references WHERE id = ? LIMIT 1',
          [result.insertId]
        );
        
        if (refs && refs.length > 0) {
          return {
            ...refs[0],
            date: new Date(refs[0].date)
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error al agregar referencia de pago:', error);
      toast.error("Error al registrar el pago");
      return null;
    }
  },
  
  // Obtener pedidos de un usuario
  getUserOrders: async (userId: string): Promise<Order[]> => {
    try {
      const orders = await query<Order[]>(
        'SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC',
        [userId]
      );
      
      // Para cada pedido, obtener sus items
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await query<CartItem[]>(
            `SELECT oi.*, p.name, p.description, pv.color, pv.price 
             FROM order_items oi
             JOIN products p ON oi.productId = p.id
             JOIN product_variants pv ON oi.variantId = pv.id
             WHERE oi.orderId = ?`,
            [order.id]
          );
          
          // Obtener la referencia de pago si existe
          const paymentRefs = await query<PaymentReference[]>(
            'SELECT * FROM payment_references WHERE orderId = ? LIMIT 1',
            [order.id]
          );
          
          return {
            ...order,
            items,
            paymentReference: paymentRefs.length > 0 ? {
              ...paymentRefs[0],
              date: new Date(paymentRefs[0].date)
            } : undefined,
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt)
          };
        })
      );
      
      return ordersWithItems;
    } catch (error) {
      console.error('Error al obtener pedidos del usuario:', error);
      return [];
    }
  }
};

