import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Menu, Minus, Package, Plus, Search, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { formatPriceARS } from '../lib/formatters';
import { formatWhatsAppMessage, openWhatsApp } from '../lib/whatsapp';
import type { Product } from '../types';

const fallbackImage = '/favicon.svg';

export const Storefront: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  useEffect(() => {
    Promise.all([fetch('/api/products'), fetch('/api/categories')]).then(async ([productsResponse, categoriesResponse]) => {
      if (productsResponse.ok) setProducts(await productsResponse.json());
      if (categoriesResponse.ok) {
        const data = await categoriesResponse.json();
        setCategories(data.map((item: { name: string }) => item.name));
      }
    }).catch(() => undefined);
  }, []);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const text = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (category === 'Todos' || product.category === category);
  }), [products, query, category]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const requestOrder = () => openWhatsApp(formatWhatsAppMessage(items, total));

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-3 font-black tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white"><Package size={18} /></span><span>Repuestos Méndez</span></a>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-500 md:flex"><a href="#inicio" className="hover:text-slate-950">Inicio</a><a href="#productos" className="hover:text-slate-950">Productos</a><a href="#ofertas" className="hover:text-slate-950">Ofertas</a></nav>
          <div className="flex items-center gap-2"><button onClick={() => setCartOpen(true)} className="relative rounded-xl p-2.5 text-slate-700 hover:bg-slate-100" aria-label="Abrir carrito"><ShoppingBag size={20} />{itemCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-black text-slate-950">{itemCount}</span>}</button><button onClick={() => setMenuOpen(!menuOpen)} className="rounded-xl p-2.5 text-slate-700 hover:bg-slate-100 md:hidden" aria-label="Abrir menú"><Menu size={20} /></button></div>
        </div>
        {menuOpen && <nav className="border-t border-slate-100 bg-white px-4 py-3 text-sm font-semibold md:hidden"><a className="block py-2" href="#inicio">Inicio</a><a className="block py-2" href="#productos">Productos</a><a className="block py-2" href="#ofertas">Ofertas</a><a className="block py-2 text-slate-500" href="/admin">Administración</a></nav>}
      </header>

      <main id="inicio">
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_380px] lg:py-24 lg:px-8"><div><p className="mb-4 text-sm font-bold uppercase tracking-[.22em] text-amber-600">Tienda online</p><h1 className="max-w-2xl text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">Todo lo que buscás, en un solo lugar.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">Explorá nuestros productos, consultá disponibilidad real y armá tu pedido de forma simple y segura.</p><a href="#productos" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 font-bold text-white hover:bg-slate-800">Ver productos <ArrowRight size={18} /></a></div><div className="rounded-3xl bg-slate-950 p-7 text-white shadow-xl"><p className="text-sm font-semibold text-amber-300">Repuestos Méndez</p><h2 className="mt-3 text-3xl font-black">Stock real y atención cercana.</h2><p className="mt-5 text-sm leading-6 text-slate-300">Encontrá lo que necesitás para mantener tu moto en marcha.</p><div className="mt-8 grid grid-cols-2 gap-3 text-xs font-semibold"><span className="rounded-xl bg-white/10 p-3">Disponibilidad actualizada</span><span className="rounded-xl bg-white/10 p-3">Compra protegida</span></div></div></section>

        <section id="productos" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-amber-600">Catálogo online</p><h2 className="mt-2 text-3xl font-black tracking-tight">Todos los productos</h2><p className="mt-2 text-slate-500">Precios y disponibilidad sincronizados con nuestro inventario.</p></div><div className="relative w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar productos" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-slate-950" /></div></div>
          <div className="mt-7 flex flex-wrap gap-2"><button onClick={() => setCategory('Todos')} className={`rounded-full px-4 py-2 text-sm font-bold ${category === 'Todos' ? 'bg-slate-950 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>Todos</button>{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-sm font-bold ${category === item ? 'bg-slate-950 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>{item}</button>)}</div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filteredProducts.map((product) => <article key={product.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex aspect-[4/3] items-center justify-center bg-slate-100 p-5"><img src={product.image || product.images?.[0] || fallbackImage} alt={product.name} className="h-full w-full object-contain" /></div><div className="p-5"><p className="text-xs font-bold uppercase tracking-wide text-amber-600">{product.category}</p><h3 className="mt-2 text-lg font-bold">{product.name}</h3><p className="mt-2 line-clamp-2 min-h-10 text-sm text-slate-500">{product.description}</p><div className="mt-5 flex items-center justify-between gap-3"><strong className="text-xl">{formatPriceARS(product.price)}</strong><button onClick={() => { addItem(product); setCartOpen(true); }} className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800">Agregar</button></div></div></article>)}</div>{filteredProducts.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500">No encontramos productos con esa búsqueda.</div>}
        </section>
        <section id="ofertas" className="border-y border-slate-200 bg-white"><div className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:grid-cols-3 sm:px-6 lg:px-8"><div><strong className="block">Stock real</strong><span className="text-sm text-slate-500">Actualizado</span></div><div><strong className="block">Compra segura</strong><span className="text-sm text-slate-500">Protegida</span></div><div><strong className="block">Asistencia online</strong><span className="text-sm text-slate-500">Te ayudamos a elegir</span></div></div></section>
      </main>

      <footer className="bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><div><strong className="text-slate-950">Repuestos Méndez</strong><p className="mt-1">Catálogo online de repuestos para tu moto.</p></div><a href="/admin" className="font-bold text-slate-700 hover:text-slate-950">Administrar catálogo</a></div></footer>

      {cartOpen && <div className="fixed inset-0 z-50 bg-slate-950/30" onClick={() => setCartOpen(false)}><aside onClick={(event) => event.stopPropagation()} className="ml-auto flex h-full w-full max-w-md flex-col bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-xl font-black">Tu pedido</h2><button onClick={() => setCartOpen(false)} aria-label="Cerrar carrito"><X /></button></div><div className="mt-8 flex-1 space-y-4 overflow-auto">{items.length === 0 ? <p className="text-slate-500">Agregá productos para empezar tu pedido.</p> : items.map((item) => <div key={item.product.id} className="flex items-center gap-3 border-b border-slate-100 pb-4"><img src={item.product.image || item.product.images?.[0] || fallbackImage} alt="" className="h-14 w-14 rounded-xl bg-slate-100 object-contain" /><div className="min-w-0 flex-1"><p className="truncate font-bold">{item.product.name}</p><p className="text-sm text-slate-500">{formatPriceARS(item.product.price)}</p><div className="mt-2 flex items-center gap-2"><button onClick={() => updateQuantity(String(item.product.id), item.quantity - 1)} className="rounded-lg bg-slate-100 p-1"><Minus size={14} /></button><span className="w-5 text-center text-sm">{item.quantity}</span><button onClick={() => updateQuantity(String(item.product.id), item.quantity + 1)} className="rounded-lg bg-slate-100 p-1"><Plus size={14} /></button></div></div></div>)}</div><div className="border-t border-slate-200 pt-5"><div className="flex justify-between text-lg font-black"><span>Total</span><span>{formatPriceARS(total)}</span></div><button onClick={requestOrder} disabled={!items.length} className="mt-4 flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 font-bold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40">Consultar por WhatsApp</button></div></aside></div>}
    </div>
  );
};
