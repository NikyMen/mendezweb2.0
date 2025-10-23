import React from 'react';
import { ShoppingBag } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div 
      className="relative text-white min-h-[600px] flex items-center"
      style={{
        backgroundImage: 'url(/backgroundLcimports.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Bienvenido a Tierra del Padel
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white drop-shadow-md">
            Paletas, pelotas y accesorios de pádel
          </p>
          <div className="flex justify-center">
            <a
              href="#productos"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              <ShoppingBag size={20} />
              <span>Ver Productos</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
