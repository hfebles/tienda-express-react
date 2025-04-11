
import { Product, Category, Tag, ProductVariant } from "../types";
import { query } from "../lib/db";

export const productService = {
  // Obtener todos los productos
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const products = await query<Product[]>('SELECT * FROM products');
      
      // Para cada producto, obtener sus variantes
      const productsWithVariants = await Promise.all(
        products.map(async (product) => {
          const variants = await query<ProductVariant[]>(
            'SELECT * FROM product_variants WHERE productId = ?',
            [product.id]
          );
          
          // Para cada variante, obtener sus imágenes
          const variantsWithImages = await Promise.all(
            variants.map(async (variant) => {
              const images = await query<{url: string}[]>(
                'SELECT url FROM variant_images WHERE variantId = ?',
                [variant.id]
              );
              
              return {
                ...variant,
                images: images.map(img => img.url)
              };
            })
          );
          
          // Obtener la categoría del producto
          const categories = await query<Category[]>(
            'SELECT * FROM categories WHERE id = ? LIMIT 1',
            [product.categoryId]
          );
          
          // Obtener las etiquetas del producto
          const tags = await query<Tag[]>(
            `SELECT t.* FROM tags t 
             JOIN product_tags pt ON t.id = pt.tagId 
             WHERE pt.productId = ?`,
            [product.id]
          );
          
          return {
            ...product,
            category: categories[0] || null,
            tags: tags || [],
            variants: variantsWithImages,
            createdAt: new Date(product.createdAt)
          };
        })
      );
      
      return productsWithVariants;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return [];
    }
  },
  
  // Obtener un producto por ID o slug
  getProductByIdOrSlug: async (idOrSlug: string): Promise<Product | null> => {
    try {
      // Primero intentamos buscar por ID
      let products = await query<Product[]>(
        'SELECT * FROM products WHERE id = ? LIMIT 1',
        [idOrSlug]
      );
      
      // Si no encontramos por ID, buscamos por slug
      if (!products.length) {
        products = await query<Product[]>(
          'SELECT * FROM products WHERE slug = ? LIMIT 1',
          [idOrSlug]
        );
      }
      
      if (!products.length) {
        return null;
      }
      
      const product = products[0];
      
      // Obtener variantes
      const variants = await query<ProductVariant[]>(
        'SELECT * FROM product_variants WHERE productId = ?',
        [product.id]
      );
      
      // Para cada variante, obtener sus imágenes
      const variantsWithImages = await Promise.all(
        variants.map(async (variant) => {
          const images = await query<{url: string}[]>(
            'SELECT url FROM variant_images WHERE variantId = ?',
            [variant.id]
          );
          
          return {
            ...variant,
            images: images.map(img => img.url)
          };
        })
      );
      
      // Obtener la categoría del producto
      const categories = await query<Category[]>(
        'SELECT * FROM categories WHERE id = ? LIMIT 1',
        [product.categoryId]
      );
      
      // Obtener las etiquetas del producto
      const tags = await query<Tag[]>(
        `SELECT t.* FROM tags t 
         JOIN product_tags pt ON t.id = pt.tagId 
         WHERE pt.productId = ?`,
        [product.id]
      );
      
      // Incrementar contador de visualizaciones
      await query(
        'UPDATE products SET views = views + 1 WHERE id = ?',
        [product.id]
      );
      
      return {
        ...product,
        category: categories[0] || null,
        tags: tags || [],
        variants: variantsWithImages,
        createdAt: new Date(product.createdAt)
      };
    } catch (error) {
      console.error('Error al obtener producto:', error);
      return null;
    }
  },
  
  // Obtener productos por categoría
  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    try {
      const products = await query<Product[]>(
        'SELECT * FROM products WHERE categoryId = ?',
        [categoryId]
      );
      
      // Igual que en getAllProducts, obtenemos las relaciones
      // Código similar al de getAllProducts pero con filtro por categoría
      
      return products;
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      return [];
    }
  },
  
  // Obtener todas las categorías
  getAllCategories: async (): Promise<Category[]> => {
    try {
      return await query<Category[]>('SELECT * FROM categories');
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return [];
    }
  },
  
  // Obtener todas las etiquetas
  getAllTags: async (): Promise<Tag[]> => {
    try {
      return await query<Tag[]>('SELECT * FROM tags');
    } catch (error) {
      console.error('Error al obtener etiquetas:', error);
      return [];
    }
  }
};

