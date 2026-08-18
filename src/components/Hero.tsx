import React from 'react';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export const Hero: React.FC = () => (
  <section
    className="relative overflow-hidden bg-slate-950 text-white"
    style={{
      backgroundImage: 'linear-gradient(115deg, rgba(2,6,23,.98), rgba(15,23,42,.8)), url(/backgroundLcimports.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-28">
      <div>
        <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-amber-300">Repuestos para tu moto</p>
        <h1 className="mb-6 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">Todo lo que necesitás, en un solo lugar.</h1>
        <p className="mb-8 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">Explorá el catálogo de Repuestos Méndez, consultá disponibilidad y armá tu pedido de forma rápida y segura.</p>
        <div className="flex flex-wrap gap-3">
          <a href="#productos" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-bold text-slate-950 shadow-lg transition hover:bg-amber-300">Ver productos <ArrowRight size={18} /></a>
          <a href="/admin" className="rounded-xl border border-white/20 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10">Ingresar al panel</a>
        </div>
        <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
          <span className="flex items-center gap-2"><Truck size={17} className="text-amber-300" /> Envíos y retiros</span>
          <span className="flex items-center gap-2"><ShieldCheck size={17} className="text-amber-300" /> Compra segura</span>
        </div>
      </div>
      <div className="hidden rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur sm:block">
        <p className="mb-2 text-sm font-semibold text-amber-300">Catálogo online</p>
        <p className="text-2xl font-bold">Encontrá el repuesto correcto para seguir en marcha.</p>
        <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-slate-300">
          <div className="rounded-2xl bg-white/10 p-4">Stock actualizado</div>
          <div className="rounded-2xl bg-white/10 p-4">Atención personalizada</div>
        </div>
      </div>
    </div>
  </section>
);
