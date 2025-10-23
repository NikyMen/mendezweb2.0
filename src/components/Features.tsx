import React from 'react';
import { Truck, Shield, Star } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¿Por qué elegir Tierra del Padel?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nos comprometemos a brindarte la mejor experiencia de compra
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Truck className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Envío Rápido
            </h3>
            <p className="text-sm text-gray-600">
              Recibe tus productos en tiempo récord
            </p>
          </div>

          <div className="text-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Productos Garantizados
            </h3>
            <p className="text-sm text-gray-600">
              Garantía de calidad y satisfacción
            </p>
          </div>

          <div className="text-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Atención Premium
            </h3>
            <p className="text-sm text-gray-600">
              Equipo disponible para ayudarte
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};