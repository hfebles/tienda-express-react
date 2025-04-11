
import { PaymentMethod } from "../types";
import { query } from "../lib/db";

export const paymentMethodService = {
  // Obtener todos los métodos de pago
  getAllPaymentMethods: async (): Promise<PaymentMethod[]> => {
    try {
      return await query<PaymentMethod[]>('SELECT * FROM payment_methods');
    } catch (error) {
      console.error('Error al obtener métodos de pago:', error);
      return [];
    }
  },
  
  // Obtener un método de pago por ID
  getPaymentMethodById: async (id: string): Promise<PaymentMethod | null> => {
    try {
      const methods = await query<PaymentMethod[]>(
        'SELECT * FROM payment_methods WHERE id = ? LIMIT 1',
        [id]
      );
      
      if (methods && methods.length > 0) {
        return methods[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error al obtener método de pago:', error);
      return null;
    }
  }
};

