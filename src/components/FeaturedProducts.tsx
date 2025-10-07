import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../types';
import { useCartStore } from '../stores/cartStore';

export const FeaturedProducts: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  // Auto-play del carrusel
  useEffect(() => {
    if (!isAutoPlaying || featuredProducts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === featuredProducts.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [featuredProducts.length, isAutoPlaying]);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products/featured');
      if (response.ok) {
        const products = await response.json();
        setFeaturedProducts(products);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === featuredProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredProducts.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-8"></div>
              <div className="h-96 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Si no hay productos destacados, mostrar mensaje vacío
  if (featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Descubre nuestros productos más populares y recomendados
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-12 text-center">
            <div className="mb-6">
              <Star size={64} className="mx-auto text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              No hay productos destacados aún
            </h3>
            <p className="text-gray-500 mb-6">
              Los productos destacados aparecerán aquí una vez que los marques desde el panel de administración.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>💡 Tip:</strong> Ve al panel de administración y marca algunos productos como "destacados" 
                para que aparezcan en este carrusel.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ⭐ Productos Destacados
          </h2>
          <p className="text-lg text-gray-600">
            Descubre nuestros productos más populares y recomendados
          </p>
        </div>

        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Carousel Container */}
          <div className="overflow-hidden rounded-xl shadow-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {featuredProducts.map((product) => (
                <div key={product.id} className="w-full flex-shrink-0">
                  <div className="bg-white overflow-hidden">
                    <div className="md:flex min-h-[250px]">
                      <div className="md:w-1/2 relative h-[200px] md:h-[250px] overflow-hidden flex items-center justify-center bg-white">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center bg-yellow-400 text-yellow-900 text-sm font-semibold px-3 py-1 rounded-full shadow-lg">
                            <Star size={14} className="mr-1 fill-current" />
                            Destacado
                          </span>
                        </div>
                      </div>
                      <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                        <div className="mb-6">
                          <span className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-4 py-2 rounded-full">
                            {product.category}
                          </span>
                        </div>
                        <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 mb-8 text-lg leading-relaxed line-clamp-4">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <p className="text-sm text-gray-500 mb-1">Precio especial</p>
                            <span className="text-4xl font-bold text-primary-600">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="bg-primary-600 text-white px-8 py-4 rounded-xl hover:bg-primary-700 transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                          >
                            <ShoppingCart size={24} />
                            <span className="font-semibold">Agregar al Carrito</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {featuredProducts.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-xl hover:bg-white transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft size={28} className="text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-xl hover:bg-white transition-all duration-300 hover:scale-110"
              >
                <ChevronRight size={28} className="text-gray-700" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {featuredProducts.length > 1 && (
            <div className="flex justify-center mt-8 space-x-3">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-primary-600 scale-125 shadow-lg' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {featuredProducts.length > 1 && isAutoPlaying && (
            <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-primary-600 h-1 rounded-full transition-all duration-100"
                style={{ 
                  width: `${((currentIndex + 1) / featuredProducts.length) * 100}%` 
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};