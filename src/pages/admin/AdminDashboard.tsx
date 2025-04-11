
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Users, TrendingUp, DollarSign } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Panel de Administración</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$10,532.50</div>
            <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Pedidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">5 pendientes de procesar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+5 nuevos esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">+0.5% desde la semana pasada</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent orders */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 text-sm text-gray-500 pb-2">
                <div>ID</div>
                <div>Cliente</div>
                <div className="text-right">Total</div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-3 text-sm items-center py-1 border-b">
                  <div className="font-medium">#12345</div>
                  <div>Juan Pérez</div>
                  <div className="text-right">$128.50</div>
                </div>
                <div className="grid grid-cols-3 text-sm items-center py-1 border-b">
                  <div className="font-medium">#12344</div>
                  <div>María García</div>
                  <div className="text-right">$95.20</div>
                </div>
                <div className="grid grid-cols-3 text-sm items-center py-1 border-b">
                  <div className="font-medium">#12343</div>
                  <div>Carlos López</div>
                  <div className="text-right">$210.00</div>
                </div>
                <div className="grid grid-cols-3 text-sm items-center py-1 border-b">
                  <div className="font-medium">#12342</div>
                  <div>Ana Rodríguez</div>
                  <div className="text-right">$45.99</div>
                </div>
                <div className="grid grid-cols-3 text-sm items-center py-1">
                  <div className="font-medium">#12341</div>
                  <div>Luis González</div>
                  <div className="text-right">$79.99</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Popular products */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 text-sm text-gray-500 pb-2">
                <div className="col-span-2">Producto</div>
                <div>Ventas</div>
                <div className="text-right">Ingresos</div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-4 text-sm items-center py-1 border-b">
                  <div className="col-span-2 font-medium">Smartphone XYZ</div>
                  <div>12</div>
                  <div className="text-right">$7,199.88</div>
                </div>
                <div className="grid grid-cols-4 text-sm items-center py-1 border-b">
                  <div className="col-span-2 font-medium">Camiseta Deportiva</div>
                  <div>28</div>
                  <div className="text-right">$839.72</div>
                </div>
                <div className="grid grid-cols-4 text-sm items-center py-1 border-b">
                  <div className="col-span-2 font-medium">Silla Ergonómica</div>
                  <div>5</div>
                  <div className="text-right">$999.95</div>
                </div>
                <div className="grid grid-cols-4 text-sm items-center py-1 border-b">
                  <div className="col-span-2 font-medium">Balón de Fútbol</div>
                  <div>15</div>
                  <div className="text-right">$749.85</div>
                </div>
                <div className="grid grid-cols-4 text-sm items-center py-1">
                  <div className="col-span-2 font-medium">Auriculares Bluetooth</div>
                  <div>8</div>
                  <div className="text-right">$639.92</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
