
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, categories, tags } from "@/lib/data";
import ProductGrid from "@/components/product/ProductGrid";
import { Product } from "@/types";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Simulate fetching featured products (with tag "Tendencia")
    const featured = products.filter(p => 
      p.tags?.some(t => t.name === "Tendencia")
    );
    setFeaturedProducts(featured);
    
    // Simulate fetching new products (with tag "Nuevo")
    const newest = products.filter(p => 
      p.tags?.some(t => t.name === "Nuevo")
    );
    setNewProducts(newest);
    
    // Simulate fetching popular products (based on views)
    const popular = [...products].sort((a, b) => b.views - a.views).slice(0, 4);
    setPopularProducts(popular);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-brand-primary to-purple-400 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Encuentra todo lo que necesitas
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Los mejores productos con los mejores precios. Compra fácil y seguro en nuestra tienda online.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="bg-white text-brand-primary hover:bg-gray-100">
                <Link to="/productos">Ver Productos</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/20">
                <Link to="/ofertas">Ver Ofertas</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Categorías</h2>
            <Button variant="ghost" asChild>
              <Link to="/categorias" className="flex items-center">
                Ver todas <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => (
              <Link 
                key={category.id}
                to={`/productos?category=${category.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 text-center"
              >
                <div className="h-12 w-12 bg-brand-primary/10 text-brand-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  {/* You would use actual icons here based on category */}
                  <span className="text-lg font-bold">{category.name.charAt(0)}</span>
                </div>
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products carousel */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Productos Destacados</h2>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <div className="overflow-hidden rounded-xl">
                      <Link to={`/producto/${product.slug}`}>
                        <img 
                          src={product.featuredImage || product.variants[0].images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full aspect-[16/9] object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">
                        <Link to={`/producto/${product.slug}`} className="hover:text-brand-primary">
                          {product.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {product.description}
                      </p>
                      <div className="mt-2 flex justify-between">
                        <span className="font-semibold">
                          ${product.variants[0].price.toFixed(2)}
                        </span>
                        <Button size="sm" asChild variant="link">
                          <Link to={`/producto/${product.slug}`}>Ver detalles</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* New products section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Nuevos Productos</h2>
            <Button variant="ghost" asChild>
              <Link to="/nuevos" className="flex items-center">
                Ver todos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <ProductGrid products={newProducts} />
        </div>
      </section>

      {/* Popular products section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Productos Populares</h2>
            <Button variant="ghost" asChild>
              <Link to="/productos?sort=popular" className="flex items-center">
                Ver todos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <ProductGrid products={popularProducts} />
        </div>
      </section>

      {/* Newsletter section */}
      <section className="py-12 bg-brand-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Suscríbete a nuestro boletín</h2>
          <p className="max-w-lg mx-auto mb-6">
            Recibe nuestras ofertas especiales y novedades directamente en tu correo.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-grow px-4 py-2 rounded-md text-black"
              required
            />
            <Button type="submit" className="bg-white text-brand-primary hover:bg-gray-100">
              Suscribirse
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Index;
