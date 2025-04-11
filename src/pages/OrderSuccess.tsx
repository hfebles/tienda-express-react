
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Home, ShoppingBag } from "lucide-react";

const OrderSuccess = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="h-24 w-24 mx-auto mb-6 text-green-500">
          <CheckCircle className="h-full w-full" />
        </div>
        <h1 className="text-2xl font-bold mb-4">¡Compra Exitosa!</h1>
        <p className="text-gray-600 mb-8">
          Gracias por tu compra. Tu pago está siendo procesado y recibirás una confirmación por email cuando sea verificado.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="font-semibold mb-4">Detalles del pedido:</h2>
          <div className="space-y-2">
            <p className="flex items-start">
              <span className="text-gray-600 inline-block w-32">Pedido:</span>
              <span className="font-medium">#12345</span>
            </p>
            <p className="flex items-start">
              <span className="text-gray-600 inline-block w-32">Fecha:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </p>
            <p className="flex items-start">
              <span className="text-gray-600 inline-block w-32">Estado:</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Procesando</span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="flex items-center">
            <Link to="/pedidos">
              <Package className="mr-2 h-4 w-4" />
              Mis Pedidos
            </Link>
          </Button>
          <Button asChild>
            <Link to="/">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Seguir Comprando
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
