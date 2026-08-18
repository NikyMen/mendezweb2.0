import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Settings, Wrench } from 'lucide-react';
import { CartButton } from './Cart/CartButton';
import { CartSidebar } from './Cart/CartSidebar';

export const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm"><Wrench size={20} /></span>
              <span>
                <span className="block text-lg font-extrabold tracking-tight text-slate-950">Repuestos Méndez</span>
                <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:block">Tienda online</span>
              </span>
            </a>

            <nav className="hidden items-center gap-8 md:flex">
              <a href="/" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950">Inicio</a>
              <a href="/#productos" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950">Productos</a>
              <a href="/admin" className="flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"><Settings size={16} /> Panel</a>
            </nav>

            <div className="flex items-center gap-3">
              <CartButton onClick={() => setIsCartOpen(true)} />
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden" aria-label="Abrir menú">
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="border-t border-slate-200 py-3 md:hidden">
              <a href="/" className="block px-3 py-2 text-slate-700">Inicio</a>
              <a href="/#productos" className="block px-3 py-2 text-slate-700">Productos</a>
              <a href="/admin" className="flex items-center gap-2 px-3 py-2 text-slate-700"><Settings size={17} /> Panel de administración</a>
            </div>
          )}
        </div>
      </header>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
