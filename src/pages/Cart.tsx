import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  
  const handleQuantityChange = (variantId: string, newQuantity: number) => {
    updateQuantity(variantId, newQuantity);
  };
  
  const handleRemoveItem = (variantId: string) => {
    removeFromCart(variantId);
  };
  
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    
    // In a real app, this would validate the coupon with an API
    toast.error("Cupón inválido o expirado");
    setCouponCode("");
  };
  
  const handleProceedToCheckout = () => {
    if (!user) {
      // If not logged in, redirect to login with return URL
      toast.info("Inicia sesión para continuar con tu compra");
      navigate("/login?redirect=/checkout");
    } else {
      // If logged in, proceed to checkout
      navigate("/checkout");
    }
  };
  
  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-20 w-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">
            Parece que no has añadido productos a tu carrito todavía.
          </p>
          <Button asChild>
            <Link to="/productos">Explorar Productos</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Tu Carrito</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header (desktop only) */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="col-span-6">
              <span className="font-medium">Producto</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="font-medium">Precio</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="font-medium">Cantidad</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="font-medium">Subtotal</span>
            </div>
          </div>
          
          {/* Cart items */}
          {cart.items.map((item) => {
            // Find product and variant details
            const product = item.product;
            const variant = item.variant;
            
            if (!product || !variant) return null;
            
            return (
              <Card key={variant.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="grid grid-cols-12 gap-4">
                    {/* Product info */}
                    <div className="col-span-12 md:col-span-6 flex gap-4">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                        <img
                          src={variant.images[0] || product.featuredImage || "/placeholder.svg"}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <Link to={`/producto/${product.slug}`} className="font-medium hover:text-brand-primary">
                          {product.name}
                        </Link>
                        <p className="text-sm text-gray-500">Color: {variant.color}</p>
                        
                        {/* Mobile price */}
                        <div className="md:hidden mt-2">
                          <span className="font-medium">${variant.price.toFixed(2)}</span>
                        </div>
                        
                        {/* Mobile remove button */}
                        <button
                          onClick={() => handleRemoveItem(variant.id)}
                          className="text-sm text-red-600 hover:text-red-800 mt-auto md:hidden flex items-center"
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                    
                    {/* Price (desktop) */}
                    <div className="hidden md:flex col-span-2 items-center justify-center">
                      <span className="font-medium">${variant.price.toFixed(2)}</span>
                    </div>
                    
                    {/* Quantity selector */}
                    <div className="col-span-6 md:col-span-2 flex items-center justify-center">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(variant.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-3 text-center min-w-[40px]">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(variant.id, item.quantity + 1)}
                          disabled={item.quantity >= variant.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Subtotal */}
                    <div className="col-span-6 md:col-span-2 flex items-center justify-end">
                      <span className="font-medium">
                        ${(variant.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    
                    {/* Remove button (desktop) */}
                    <div className="hidden md:flex col-span-12 justify-end">
                      <button
                        onClick={() => handleRemoveItem(variant.id)}
                        className="text-sm text-red-600 hover:text-red-800 flex items-center"
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Order summary */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Resumen del Pedido</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cart.items.length} productos)</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span>Calculado al finalizar</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuestos</span>
                  <span>Calculado al finalizar</span>
                </div>
              </div>
              
              {/* Apply coupon */}
              <div className="mt-6">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Código de cupón"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow"
                  />
                  <Button type="submit" variant="outline">
                    Aplicar
                  </Button>
                </form>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
              
              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handleProceedToCheckout}
              >
                Proceder al Pago
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="mt-6 text-center">
                <Link
                  to="/productos"
                  className="text-sm text-brand-primary hover:underline"
                >
                  Continuar Comprando
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
