
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "@/components/product/ProductGrid";
import { Product } from "@/types";
import { productService } from "@/services/productService";

const Products = () => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState<string>("Todos los productos");
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Cargar productos, categorías y etiquetas
        const [allProducts, allCategories, allTags] = await Promise.all([
          productService.getAllProducts(),
          productService.getAllCategories(),
          productService.getAllTags()
        ]);
        
        setCategories(allCategories);
        setTags(allTags);
        
        // Get search parameters
        const searchTerm = searchParams.get("search");
        const categoryId = searchParams.get("category");
        const tagSlug = searchParams.get("tag");
        const sortBy = searchParams.get("sort");
        
        // Filter products
        let filtered = [...allProducts];
        
        // Apply search filter
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(term) || 
            product.description.toLowerCase().includes(term)
          );
          setTitle(`Resultados para "${searchTerm}"`);
        }
        
        // Apply category filter
        if (categoryId) {
          filtered = filtered.filter(product => product.categoryId === categoryId);
          const category = allCategories.find(c => c.id === categoryId);
          if (category) {
            setTitle(category.name);
          }
        }
        
        // Apply tag filter
        if (tagSlug) {
          filtered = filtered.filter(product => 
            product.tags?.some(tag => tag.slug === tagSlug)
          );
          const tag = allTags.find(t => t.slug === tagSlug);
          if (tag) {
            setTitle(`Productos con etiqueta "${tag.name}"`);
          }
        }
        
        // Apply sorting
        if (sortBy === "price-asc") {
          filtered.sort((a, b) => {
            const aMinPrice = Math.min(...a.variants.map(v => v.price));
            const bMinPrice = Math.min(...b.variants.map(v => v.price));
            return aMinPrice - bMinPrice;
          });
        } else if (sortBy === "price-desc") {
          filtered.sort((a, b) => {
            const aMaxPrice = Math.max(...a.variants.map(v => v.price));
            const bMaxPrice = Math.max(...b.variants.map(v => v.price));
            return bMaxPrice - aMaxPrice;
          });
        } else if (sortBy === "name-asc") {
          filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "name-desc") {
          filtered.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortBy === "popular") {
          filtered.sort((a, b) => b.views - a.views);
        }
        
        setFilteredProducts(filtered);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [searchParams]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <p>Cargando productos...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">{title}</h1>
      <ProductGrid 
        products={filteredProducts} 
        categories={categories} 
        tags={tags}
        initialCategory={searchParams.get("category") || undefined}
      />
    </div>
  );
};

export default Products;
