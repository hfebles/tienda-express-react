import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { products, categories } from "@/lib/data";
import { Product, ProductVariant } from "@/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { ShoppingCart, Heart, Share, ChevronRight, Minus, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ProductGrid from "@/components/product/ProductGrid";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  
  useEffect(() => {
    setLoading(true);
    
    const foundProduct = products.find(p => p.slug === slug);
    
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedVariant(foundProduct.variants[0]);
      
      const related = products.filter(p => 
        p.id !== foundProduct.id && p.categoryId === foundProduct.categoryId
      ).slice(0, 4);
      setRelatedProducts(related);
    }
    
    setLoading(false);
  }, [slug]);
  
  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (selectedVariant && newQuantity > selectedVariant.stock) {
      toast("No hay suficiente stock disponible");
      return;
    }
    setQuantity(newQuantity);
  };
  
  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    
    addToCart(product.id, selectedVariant.id, quantity);
    setQuantity(1);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <p>Cargando detalles del producto...</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
        <p className="mb-6">Lo sentimos, el producto que buscas no existe o ha sido removido.</p>
        <Button asChild>
          <Link to="/productos">Ver todos los productos</Link>
        </Button>
      </div>
    );
  }
  
  const category = categories.find(c => c.id === product.categoryId);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center text-sm text-gray-500">
        <Link to="/" className="hover:text-brand-primary">Inicio</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/productos" className="hover:text-brand-primary">Productos</Link>
        {category && (
          <>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link to={`/categorias/${category.slug}`} className="hover:text-brand-primary">{category.name}</Link>
          </>
        )}
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="truncate max-w-[150px] sm:max-w-none">{product.name}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          {selectedVariant && (
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img 
                src={selectedVariant.images[0] || product.featuredImage || "/placeholder.svg"} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {selectedVariant && selectedVariant.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {selectedVariant.images.map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-md border cursor-pointer">
                  <img 
                    src={image || "/placeholder.svg"} 
                    alt={`${product.name} - Imagen ${index + 1}`} 
                    className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {product.tags?.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
          
          {selectedVariant && (
            <div className="mb-6">
              <p className="text-3xl font-bold text-brand-primary">
                ${selectedVariant.price.toFixed(2)}
              </p>
              
              {selectedVariant.stock > 0 ? (
                <p className="text-sm text-green-600 mt-1">
                  En stock ({selectedVariant.stock} disponibles)
                </p>
              ) : (
                <p className="text-sm text-red-500 mt-1">
                  Agotado
                </p>
              )}
            </div>
          )}
          
          {product.variants.length > 1 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Color:</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(variant => (
                  <button
                    key={variant.id}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                      ${selectedVariant?.id === variant.id 
                        ? 'border-brand-primary' 
                        : 'border-gray-200'
                      }`}
                    style={{ 
                      backgroundColor: variant.color.toLowerCase() === "blanco" ? "#FFFFFF" : 
                                       variant.color.toLowerCase() === "negro" ? "#000000" : 
                                       variant.color.toLowerCase() === "rojo" ? "#FF0000" : 
                                       variant.color.toLowerCase() === "azul" ? "#0000FF" : 
                                       "#CCCCCC" 
                    }}
                    onClick={() => handleVariantChange(variant)}
                    title={variant.color}
                  >
                    {selectedVariant?.id === variant.id && (
                      <div className="w-6 h-6 bg-white rounded-full border flex items-center justify-center">
                        <div className="w-4 h-4 bg-brand-primary rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Color seleccionado: {selectedVariant?.color}
              </p>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Cantidad:</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 mx-2 border rounded-md min-w-[3rem] text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={selectedVariant ? quantity >= selectedVariant.stock : true}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-8">
            <Button 
              className="flex-1" 
              size="lg" 
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Añadir al carrito
            </Button>
            
            <Button variant="outline" size="icon" className="aspect-square h-[42px]">
              <Heart className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon" className="aspect-square h-[42px]">
              <Share className="h-4 w-4" />
            </Button>
          </div>
          
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="shipping">Envío</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 text-gray-700">
              <p>{product.description}</p>
            </TabsContent>
            <TabsContent value="details" className="mt-4 text-gray-700">
              <ul className="space-y-2">
                <li><strong>Categoría:</strong> {category?.name}</li>
                <li><strong>Colores disponibles:</strong> {product.variants.map(v => v.color).join(", ")}</li>
                <li><strong>ID de Producto:</strong> {product.id}</li>
              </ul>
            </TabsContent>
            <TabsContent value="shipping" className="mt-4 text-gray-700">
              <p>Envío estándar de 3-5 días hábiles.</p>
              <p>Envío express disponible por un costo adicional.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Productos relacionados</h2>
        <ProductGrid products={relatedProducts} />
      </div>
    </div>
  );
};

export default ProductDetail;
