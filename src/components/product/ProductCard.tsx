
import { Link } from "react-router-dom";
import { Product, ProductVariant } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, Tag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  
  // Get the first variant for display purposes
  const firstVariant: ProductVariant = product.variants[0];
  
  // Check if there are multiple variants with different prices
  const hasDifferentPrices = product.variants.some(v => v.price !== firstVariant.price);
  
  // Get min and max prices if there are different prices
  const minPrice = Math.min(...product.variants.map(v => v.price));
  const maxPrice = Math.max(...product.variants.map(v => v.price));
  
  const handleAddToCart = () => {
    // Add the first variant to cart by default
    addToCart(product.id, firstVariant.id, 1);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <Link to={`/producto/${product.slug}`}>
          <img
            src={product.featuredImage || firstVariant.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="w-full aspect-[4/3] object-cover"
          />
        </Link>
        
        {/* Tags */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {product.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
      
      <CardContent className="flex-grow p-4">
        <Link to={`/producto/${product.slug}`} className="hover:text-brand-primary">
          <h3 className="font-medium line-clamp-2">{product.name}</h3>
        </Link>
        
        <div className="mt-2 flex justify-between items-center">
          <div>
            {hasDifferentPrices ? (
              <p className="font-semibold text-sm">
                ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}
              </p>
            ) : (
              <p className="font-semibold">${firstVariant.price.toFixed(2)}</p>
            )}
            
            {product.variants.length > 1 && (
              <p className="text-xs text-gray-500 mt-1">
                {product.variants.length} variantes
              </p>
            )}
          </div>
          
          {/* Colors preview */}
          {product.variants.length > 1 && (
            <div className="flex -space-x-1 overflow-hidden">
              {product.variants.slice(0, 3).map((variant) => (
                <div 
                  key={variant.id} 
                  className="inline-block h-4 w-4 rounded-full border-2 border-white" 
                  style={{ backgroundColor: variant.color.toLowerCase() === "blanco" ? "#FFFFFF" : 
                           variant.color.toLowerCase() === "negro" ? "#000000" : 
                           variant.color.toLowerCase() === "rojo" ? "#FF0000" : 
                           variant.color.toLowerCase() === "azul" ? "#0000FF" : 
                           "#CCCCCC" }} 
                  title={variant.color}
                />
              ))}
              {product.variants.length > 3 && (
                <div className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-gray-200 text-xs font-bold">
                  +{product.variants.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Añadir
        </Button>
        <Button
          size="icon"
          variant="ghost"
          asChild
        >
          <Link to={`/producto/${product.slug}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
