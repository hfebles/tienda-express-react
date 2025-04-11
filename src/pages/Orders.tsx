
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Eye } from "lucide-react";

// Mock order data
const mockOrders = [
  {
    id: "ORD-001",
    date: new Date(2023, 3, 15),
    status: "processing",
    items: 3,
    total: 129.97,
  },
  {
    id: "ORD-002",
    date: new Date(2023, 2, 28),
    status: "delivered",
    items: 1,
    total: 59.99,
  },
  {
    id: "ORD-003",
    date: new Date(2023, 1, 10),
    status: "cancelled",
    items: 2,
    total: 45.98,
  },
];

// Status badge color mapping
const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

// Status label mapping
const statusLabels = {
  pending: "Pendiente",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders] = useState(mockOrders);
  
  // If not logged in, redirect to login
  if (!user) {
    navigate("/login?redirect=/pedidos");
    return null;
  }
  
  // Empty state
  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-20 w-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">No tienes pedidos</h1>
          <p className="text-gray-600 mb-8">
            Aún no has realizado ningún pedido. Empieza a comprar para ver tus pedidos aquí.
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
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Mis Pedidos</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="md:flex justify-between items-start">
                {/* Order info */}
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">#{order.id}</h3>
                    <Badge
                      variant="outline"
                      className={`${statusColors[order.status as keyof typeof statusColors]}`}
                    >
                      {statusLabels[order.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Fecha: {order.date.toLocaleDateString()}
                  </div>
                  <div className="mt-2">
                    <p>{order.items} productos | ${order.total.toFixed(2)}</p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-3">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/pedido/${order.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Link>
                  </Button>
                  {(order.status === "delivered" || order.status === "shipped") && (
                    <Button size="sm">Seguimiento</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
