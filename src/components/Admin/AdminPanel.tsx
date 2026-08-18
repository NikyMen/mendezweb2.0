import React, { useEffect, useState } from 'react';
import { BarChart3, Boxes, FolderKanban, LogOut, Menu, Package, Plus, Settings, X } from 'lucide-react';
import { AdminLogin } from './AdminLogin';
import { ProductForm } from './ProductForm';
import { ProductList } from './ProductList';
import { CategoryForm } from './CategoryForm';
import { CategoryList } from './CategoryList';
import type { Category, Product } from '../../types';

type View = 'overview' | 'products' | 'categories';

export const AdminPanel: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productForm, setProductForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem('admin_authenticated') === 'true';
    setAuthenticated(logged);
    setLoading(false);
    if (logged) loadData();
  }, []);

  const loadData = async () => {
    const [productsResponse, categoriesResponse] = await Promise.all([fetch('/api/products'), fetch('/api/categories')]);
    if (productsResponse.ok) setProducts(await productsResponse.json());
    if (categoriesResponse.ok) setCategories(await categoriesResponse.json());
  };

  const login = async (username: string, password: string) => {
    const response = await fetch('/api/admin-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    const data = await response.json();
    if (!data.success) return false;
    localStorage.setItem('admin_authenticated', 'true');
    setAuthenticated(true);
    await loadData();
    return true;
  };

  const logout = () => { localStorage.removeItem('admin_authenticated'); setAuthenticated(false); };
  const closeForms = () => { setProductForm(false); setCategoryForm(false); setEditingProduct(undefined); setEditingCategory(undefined); };

  const saveProduct = async (data: unknown) => {
    const editing = editingProduct;
    await fetch(editing ? `/api/products/${editing.id}` : '/api/products', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    closeForms();
    await loadData();
  };

  const deleteProduct = async (id: string) => { await fetch(`/api/products/${id}`, { method: 'DELETE' }); await loadData(); };
  const saveCategory = async (data: unknown) => {
    const editing = editingCategory;
    await fetch(editing ? `/api/categories/${editing.id}` : '/api/categories', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    closeForms();
    await loadData();
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center text-slate-500">Cargando panel…</div>;
  if (!authenticated) return <AdminLogin onLogin={login} />;

  const navigation = [
    { id: 'overview' as View, label: 'Resumen', icon: BarChart3 },
    { id: 'products' as View, label: 'Productos', icon: Package },
    { id: 'categories' as View, label: 'Categorías', icon: FolderKanban },
  ];

  return <div className="min-h-screen bg-[#f8fafc] text-slate-900">
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-800 bg-slate-950 p-5 text-white transition-transform lg:translate-x-0 ${mobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between"><a href="/" className="text-lg font-black">Repuestos Méndez</a><button className="lg:hidden" onClick={() => setMobileMenu(false)}><X size={20} /></button></div>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[.18em] text-slate-500">Panel de gestión</p>
      <nav className="mt-10 space-y-2">{navigation.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setView(id); setMobileMenu(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${view === id ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><Icon size={18} />{label}</button>)}</nav>
      <div className="absolute bottom-5 left-5 right-5 space-y-2"><a href="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"><Boxes size={18} />Ver tienda</a><button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"><LogOut size={18} />Cerrar sesión</button></div>
    </aside>
    <div className="lg:pl-64"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8"><button onClick={() => setMobileMenu(true)} className="rounded-xl p-2 hover:bg-slate-100 lg:hidden"><Menu size={20} /></button><div className="hidden text-sm text-slate-500 sm:block">Administración / <span className="font-bold text-slate-900">{navigation.find((item) => item.id === view)?.label}</span></div><div className="ml-auto flex items-center gap-2 text-sm font-semibold text-slate-500"><Settings size={17} /> Cuenta administradora</div></header>
      <main className="mx-auto max-w-7xl p-4 sm:p-8"><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-amber-600">Panel básico</p><h1 className="mt-2 text-3xl font-black tracking-tight">{view === 'overview' ? 'Resumen de la tienda' : navigation.find((item) => item.id === view)?.label}</h1><p className="mt-2 text-slate-500">Gestioná el contenido que aparece en Repuestos Méndez.</p></div>{view === 'products' ? <button onClick={() => { setEditingProduct(undefined); setProductForm(true); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"><Plus size={18} />Nuevo producto</button> : view === 'categories' ? <button onClick={() => { setEditingCategory(undefined); setCategoryForm(true); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"><Plus size={18} />Nueva categoría</button> : null}</div>
        {view === 'overview' && <><div className="grid gap-4 sm:grid-cols-3"><Stat label="Productos" value={products.length} icon={<Package />} /><Stat label="Categorías" value={categories.length} icon={<FolderKanban />} /><Stat label="Valor del catálogo" value={`$${products.reduce((sum, product) => sum + product.price, 0).toLocaleString('es-AR')}`} icon={<BarChart3 />} /></div><section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><h2 className="font-black">Productos recientes</h2><button onClick={() => setView('products')} className="text-sm font-bold text-amber-700">Ver todos</button></div><div className="mt-4 divide-y divide-slate-100">{products.slice(0, 5).map((product) => <div key={product.id} className="flex items-center justify-between py-3"><span className="font-semibold">{product.name}</span><span className="text-sm text-slate-500">{product.category} · ${product.price.toLocaleString('es-AR')}</span></div>)}{!products.length && <p className="py-5 text-sm text-slate-500">Todavía no hay productos cargados.</p>}</div></section></>}
        {view === 'products' && <ProductList products={products} onEdit={(product) => { setEditingProduct(product); setProductForm(true); }} onDelete={deleteProduct} onView={() => undefined} />}
        {view === 'categories' && <CategoryList onEdit={(category) => { setEditingCategory(category); setCategoryForm(true); }} onDelete={() => undefined} onCreate={() => setCategoryForm(true)} />}
      </main></div>
    {productForm && <ProductForm product={editingProduct} categories={categories.map((category) => category.name)} onSubmit={saveProduct} onCancel={closeForms} />}
    {categoryForm && <CategoryForm category={editingCategory} onSave={saveCategory} onClose={closeForms} />}
  </div>;
};

const Stat: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">{label}</span><span className="text-amber-500">{icon}</span></div><strong className="mt-4 block text-2xl font-black">{value}</strong></div>;
