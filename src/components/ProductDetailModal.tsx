import React, { useState } from 'react';
import { X, ShoppingCart, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useNotification } from '../hooks/useNotification';
import { formatPriceARS } from '../lib/formatters';
import type { Product } from '../types';

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  isOpen, 
  onClose 
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const { showSuccess } = useNotification();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  // Obtener todas las imágenes disponibles
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const currentImage = allImages[currentImageIndex] || product.image;

  const handleAddToCart = () => {
    addItem(product, quantity);
    showSuccess(`${product.name} se añadió correctamente al carrito`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    setIsZoomed(false); // Reset zoom when changing image
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setIsZoomed(false); // Reset zoom when changing image
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 z-40 overflow-y-auto"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Image section */}
            <div className="w-full md:w-1/2 relative bg-gray-100">
              <div 
                className={`relative overflow-hidden ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'} aspect-square`}
                onClick={toggleZoom}
              >
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={product.name}
                    className={`w-full h-full object-contain transition-transform duration-300 ${
                      isZoomed 
                        ? 'scale-150' 
                        : 'scale-100'
                    }`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No hay imagen disponible</span>
                  </div>
                )}

                {/* Zoom button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleZoom();
                  }}
                  className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                >
                  {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
                </button>
              </div>

              {/* Image navigation */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {/* Image indicators */}
                  <div className="flex items-center space-x-1 px-2">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                          setIsZoomed(false);
                        }}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-primary-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Product details section */}
            <div className="w-full md:w-1/2 p-6 overflow-y-auto max-h-[60vh] md:max-h-[80vh]">
              <div className="mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {product.category}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {product.name}
              </h2>
              
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary-600">
                  {formatPriceARS(product.price)}
                </span>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                <p className="text-gray-700">
                  {product.description || "Sin descripción disponible"}
                </p>
              </div>
              
              {/* Quantity selector */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Cantidad</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="px-3 py-1 border rounded-md"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border rounded-md">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 border rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-md font-medium transition-colors bg-primary-600 text-white hover:bg-primary-700"
              >
                <ShoppingCart size={20} />
                <span>Agregar al carrito</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};