
import React, { createContext, useState, useContext, useEffect } from "react";
import { Cart, CartItem, Product, ProductVariant } from "../types";
import { products } from "../lib/data";
import { toast } from "@/components/ui/sonner";

interface CartContextType {
  cart: Cart;
  addToCart: (productId: string, variantId: string, quantity: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [itemCount, setItemCount] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        
        // Calculate item count
        const count = parsedCart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
        setItemCount(count);
      } catch (error) {
        console.error("Error parsing cart from localStorage", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Calculate item count
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    setItemCount(count);
  }, [cart]);

  const findProduct = (productId: string): Product | undefined => {
    return products.find(p => p.id === productId);
  };

  const findVariant = (product: Product, variantId: string): ProductVariant | undefined => {
    return product.variants.find(v => v.id === variantId);
  };

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((sum, item) => {
      const product = findProduct(item.productId);
      if (!product) return sum;
      
      const variant = findVariant(product, item.variantId);
      if (!variant) return sum;
      
      return sum + (variant.price * item.quantity);
    }, 0);
  };

  const addToCart = (productId: string, variantId: string, quantity: number) => {
    const product = findProduct(productId);
    if (!product) {
      toast.error("Producto no encontrado");
      return;
    }
    
    const variant = findVariant(product, variantId);
    if (!variant) {
      toast.error("Variante de producto no encontrada");
      return;
    }
    
    if (quantity > variant.stock) {
      toast.error("No hay suficiente stock disponible");
      return;
    }
    
    setCart(currentCart => {
      const existingItemIndex = currentCart.items.findIndex(item => item.variantId === variantId);
      
      let updatedItems: CartItem[];
      
      if (existingItemIndex !== -1) {
        // Update existing item
        const existingItem = currentCart.items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        
        if (newQuantity > variant.stock) {
          toast.error("No hay suficiente stock disponible");
          return currentCart;
        }
        
        updatedItems = [...currentCart.items];
        updatedItems[existingItemIndex] = { ...existingItem, quantity: newQuantity };
      } else {
        // Add new item
        const newItem: CartItem = {
          productId,
          variantId,
          quantity,
          product: { ...product, variants: [variant] },
          variant
        };
        updatedItems = [...currentCart.items, newItem];
      }
      
      const total = calculateTotal(updatedItems);
      
      toast.success(`${product.name} añadido al carrito`);
      return { items: updatedItems, total };
    });
  };

  const removeFromCart = (variantId: string) => {
    setCart(currentCart => {
      const updatedItems = currentCart.items.filter(item => item.variantId !== variantId);
      const total = calculateTotal(updatedItems);
      toast.info("Producto eliminado del carrito");
      return { items: updatedItems, total };
    });
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    setCart(currentCart => {
      const itemIndex = currentCart.items.findIndex(item => item.variantId === variantId);
      
      if (itemIndex === -1) return currentCart;
      
      const item = currentCart.items[itemIndex];
      const product = findProduct(item.productId);
      if (!product) return currentCart;
      
      const variant = findVariant(product, variantId);
      if (!variant) return currentCart;
      
      if (quantity > variant.stock) {
        toast.error("No hay suficiente stock disponible");
        return currentCart;
      }
      
      const updatedItems = [...currentCart.items];
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        updatedItems.splice(itemIndex, 1);
      } else {
        // Update quantity
        updatedItems[itemIndex] = { ...item, quantity };
      }
      
      const total = calculateTotal(updatedItems);
      return { items: updatedItems, total };
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};
