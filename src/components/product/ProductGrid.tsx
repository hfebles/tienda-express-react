
import { useState } from "react";
import { Product, Category, Tag } from "@/types";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductGridProps {
  products: Product[];
  categories?: Category[];
  tags?: Tag[];
  title?: string;
  initialCategory?: string;
}

const ProductGrid = ({ products: initialProducts, categories, tags, title, initialCategory }: ProductGridProps) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("default");
  
  // Filter products based on selected filters
  const applyFilters = () => {
    let result = [...initialProducts];
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(product => 
        selectedCategories.includes(product.categoryId)
      );
    }
    
    // Apply tag filter
    if (selectedTags.length > 0) {
      result = result.filter(product => 
        product.tags?.some(tag => selectedTags.includes(tag.id))
      );
    }
    
    // Apply sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => {
        const aMinPrice = Math.min(...a.variants.map(v => v.price));
        const bMinPrice = Math.min(...b.variants.map(v => v.price));
        return aMinPrice - bMinPrice;
      });
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => {
        const aMaxPrice = Math.max(...a.variants.map(v => v.price));
        const bMaxPrice = Math.max(...b.variants.map(v => v.price));
        return bMaxPrice - aMaxPrice;
      });
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "popular") {
      result.sort((a, b) => b.views - a.views);
    }
    
    setFilteredProducts(result);
  };
  
  // Handle category filter change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(current => {
      const updated = current.includes(categoryId)
        ? current.filter(id => id !== categoryId)
        : [...current, categoryId];
        
      return updated;
    });
  };
  
  // Handle tag filter change
  const handleTagChange = (tagId: string) => {
    setSelectedTags(current => {
      const updated = current.includes(tagId)
        ? current.filter(id => id !== tagId)
        : [...current, tagId];
        
      return updated;
    });
  };
  
  // Apply filters whenever selection changes
  const handleApplyFilters = () => {
    applyFilters();
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex gap-2 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:flex hidden items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              
              {/* Categories */}
              {categories && categories.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Categorías</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category.id}`} 
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => handleCategoryChange(category.id)}
                        />
                        <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Etiquetas</h3>
                  <div className="space-y-2">
                    {tags.map(tag => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`tag-${tag.id}`} 
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={() => handleTagChange(tag.id)}
                        />
                        <Label htmlFor={`tag-${tag.id}`}>{tag.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8">
                <Button onClick={handleApplyFilters} className="w-full">
                  Aplicar Filtros
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          
          <p className="text-gray-500 text-sm">
            Mostrando {filteredProducts.length} productos
          </p>
        </div>
        
        {/* Sort dropdown */}
        <div className="flex items-center">
          <span className="mr-2 text-sm">Ordenar por:</span>
          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value);
              setTimeout(() => applyFilters(), 0);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Relevancia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Relevancia</SelectItem>
              <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
              <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
              <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
              <SelectItem value="popular">Popularidad</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
          <p className="text-gray-500">Prueba con otros filtros o busca otra cosa.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
