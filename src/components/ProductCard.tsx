import React, { useState } from 'react';
import { ShoppingCart, Package, Star, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useNotification } from '../hooks/useNotification';
import { Notification } from './Notification';
import { ProductDetailModal } from './ProductDetailModal';
import { formatPriceARS } from '../lib/formatters';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const { notification, showSuccess, hideNotification } = useNotification();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se abra el modal al hacer clic en "Agregar"
    addItem(product, 1);
    showSuccess(`${product.name} se añadió correctamente al carrito`);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Obtener todas las imágenes disponibles
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const currentImage = allImages[currentImageIndex] || product.image;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se abra el modal al navegar por las imágenes
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se abra el modal al navegar por las imágenes
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
        onClick={openModal}
      >
        <div className="relative">
          <div className="aspect-square w-full overflow-hidden bg-gray-100">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Botón de vista detallada */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openModal();
              }}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            >
              <Eye size={20} />
            </button>
          </div>
          
          {/* Navegación de imágenes */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-opacity"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-opacity"
              >
                <ChevronRight size={16} />
              </button>
              
              {/* Indicadores de imágenes */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation(); // Evitar que se abra el modal al cambiar de imagen
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="p-4">
          <div className="mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {product.category}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 text-gray-300" />
              <span className="text-sm text-gray-500 ml-1">(4.0)</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary-600">
                {formatPriceARS(product.price)}
              </span>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors bg-primary-600 text-white hover:bg-primary-700"
            >
              <ShoppingCart size={16} />
              <span>Agregar</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal de detalle del producto */}
      <ProductDetailModal 
        product={product}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
      
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </>
  );
};
