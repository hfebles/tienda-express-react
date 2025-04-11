
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import { paymentMethods, banks } from "@/lib/data";
import { PaymentMethod } from "@/types";
import { Check, CreditCard, Landmark, Phone } from "lucide-react";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State for form fields
  const [shippingAddress, setShippingAddress] = useState(user?.address || "");
  const [shippingCity, setShippingCity] = useState(user?.city || "");
  const [paymentType, setPaymentType] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  
  // Payment reference data
  const [bankOrigin, setBankOrigin] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [referenceDate, setReferenceDate] = useState("");
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  
  // Mock image upload preview URL
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  
  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReferenceImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handlePaymentTypeChange = (value: string) => {
    setPaymentType(value);
    setSelectedPaymentMethod(null);
  };
  
  // Filter payment methods by selected type
  const filteredPaymentMethods = paymentType 
    ? paymentMethods.filter(method => method.type === paymentType)
    : [];
  
  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };
  
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!shippingAddress || !shippingCity || !selectedPaymentMethod) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }
    
    if (!bankOrigin || !referenceNumber || !referenceDate || !referenceImage) {
      toast.error("Por favor completa la información del pago");
      return;
    }
    
    // Simulate order placement
    try {
      // In a real app, this would be an API call to create an order
      setTimeout(() => {
        clearCart(); // Clear cart after successful order
        toast.success("Pago recibido. Su compra está siendo procesada.");
        navigate("/pedido-exitoso");
      }, 1500);
    } catch (error) {
      toast.error("Ocurrió un error al procesar el pedido. Intente nuevamente.");
    }
  };
  
  // Redirect if cart is empty
  if (cart.items.length === 0) {
    navigate("/carrito");
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Finalizar Compra</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Customer & Shipping info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer info */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="customer-name">Nombre</Label>
                  <Input
                    id="customer-name" 
                    type="text" 
                    value={user?.name || ""} 
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-email">Email</Label>
                  <Input
                    id="customer-email" 
                    type="email" 
                    value={user?.email || ""} 
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-dni">DNI</Label>
                  <Input
                    id="customer-dni" 
                    type="text" 
                    value={user?.dni || ""} 
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-phone">Teléfono</Label>
                  <Input
                    id="customer-phone" 
                    type="text" 
                    value={user?.phone || ""} 
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Shipping info */}
          <Card>
            <CardHeader>
              <CardTitle>Dirección de Envío</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Textarea 
                    id="address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ciudad</Label>
                  <Input 
                    id="city"
                    type="text"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment methods */}
          <Card>
            <CardHeader>
              <CardTitle>Método de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Payment type selection */}
              <RadioGroup 
                value={paymentType} 
                onValueChange={handlePaymentTypeChange}
                className="mb-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pago_movil" id="pago-movil" />
                  <Label htmlFor="pago-movil" className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    Pago Móvil
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transferencia" id="transferencia" />
                  <Label htmlFor="transferencia" className="flex items-center">
                    <Landmark className="mr-2 h-4 w-4" />
                    Transferencia Bancaria
                  </Label>
                </div>
              </RadioGroup>
              
              {/* Available methods based on selected type */}
              {paymentType && (
                <div>
                  <h3 className="font-medium text-sm mb-3">Seleccione una cuenta:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPaymentMethods.map(method => (
                      <div
                        key={method.id}
                        className={`border rounded-md p-4 cursor-pointer transition-colors ${
                          selectedPaymentMethod?.id === method.id
                            ? "border-brand-primary bg-brand-primary/5"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleSelectPaymentMethod(method)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{method.bank}</p>
                            {method.type === "pago_movil" ? (
                              <>
                                <p className="text-sm text-gray-600">Teléfono: {method.phone}</p>
                                <p className="text-sm text-gray-600">DNI: {method.dni}</p>
                              </>
                            ) : (
                              <>
                                <p className="text-sm text-gray-600">
                                  Nº Cuenta: {method.accountNumber}
                                </p>
                                <p className="text-sm text-gray-600">DNI: {method.dni}</p>
                                <p className="text-sm text-gray-600">
                                  Titular: {method.holderName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Tipo: {method.accountType === "ahorro" ? "Ahorro" : "Corriente"}
                                </p>
                              </>
                            )}
                          </div>
                          {selectedPaymentMethod?.id === method.id && (
                            <div className="h-6 w-6 rounded-full bg-brand-primary flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Payment reference section */}
              {selectedPaymentMethod && (
                <div className="mt-8">
                  <h3 className="font-medium mb-4">Información de Pago</h3>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="bank-origin">Banco de Origen</Label>
                      <Select 
                        value={bankOrigin}
                        onValueChange={setBankOrigin}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione su banco" />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map((bank, index) => (
                            <SelectItem key={index} value={bank}>{bank}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="reference-number">Número de Referencia</Label>
                      <Input 
                        id="reference-number" 
                        type="text" 
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reference-date">Fecha de Pago</Label>
                      <Input 
                        id="reference-date" 
                        type="date" 
                        value={referenceDate}
                        onChange={(e) => setReferenceDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reference-image">Comprobante de Pago</Label>
                      <Input 
                        id="reference-image" 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        className="py-1"
                      />
                      {imagePreviewUrl && (
                        <div className="mt-2">
                          <img 
                            src={imagePreviewUrl} 
                            alt="Preview" 
                            className="h-32 object-contain border rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Order summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Item list */}
              <div className="space-y-3 mb-4">
                {cart.items.map((item) => {
                  const product = item.product;
                  const variant = item.variant;
                  
                  if (!product || !variant) return null;
                  
                  return (
                    <div key={variant.id} className="flex justify-between">
                      <div className="flex-grow">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          {variant.color} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(variant.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              <Separator className="my-4" />
              
              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>$10.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos</span>
                  <span>${(cart.total * 0.16).toFixed(2)}</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${(cart.total + 10 + cart.total * 0.16).toFixed(2)}</span>
                </div>
              </div>
              
              {/* Submit button */}
              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={!selectedPaymentMethod}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Confirmar Pedido
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
