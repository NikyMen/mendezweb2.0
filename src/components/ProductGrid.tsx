import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ProductCard } from './ProductCard';
import { SearchBar } from './SearchBar';
import { Package, Loader2, X } from 'lucide-react';
import type { Product } from '../types';

interface ProductGridProps {
  onCartUpdate?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onCartUpdate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.map((cat: any) => cat.name));
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  // Optimized filtering with useMemo
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filtrar por búsqueda
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    return filtered;
  }, [products, debouncedSearchQuery, selectedCategory]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  const handleToggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory(null);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Search and Filters */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        showFilters={showFilters}
        onToggleFilters={handleToggleFilters}
      />

      {/* Results Info */}
      <div className="mb-6">
        <p className="text-sm text-slate-500">
          {filteredProducts.length === 0 ? (
            'No se encontraron productos'
          ) : (
            `Mostrando ${filteredProducts.length} de ${products.length} productos`
          )}
        </p>
        {(searchQuery || selectedCategory) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {searchQuery && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Búsqueda: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-1 text-primary-600 hover:text-primary-800"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Categoría: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="ml-1 text-primary-600 hover:text-primary-800"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchQuery || selectedCategory ? 'No se encontraron productos' : 'No hay productos disponibles'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || selectedCategory 
              ? 'Intenta con otros términos de búsqueda o filtros diferentes.'
              : 'Los productos aparecerán aquí cuando estén disponibles.'
            }
          </p>
          {(searchQuery || selectedCategory) && (
            <button
              onClick={handleClearFilters}
              className="mt-4 text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
};
