import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  categories: string[];
  showFilters: boolean;
  onToggleFilters: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange, selectedCategory, onCategoryChange, categories, showFilters, onToggleFilters }) => (
  <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
        <input type="text" placeholder="¿Qué repuesto estás buscando?" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 placeholder-slate-400 focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950" />
      </div>
      <button onClick={onToggleFilters} className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-3 font-semibold transition ${showFilters ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}><Filter size={17} /> Filtros</button>
    </div>
    {showFilters && <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
      <button onClick={() => onCategoryChange(null)} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${selectedCategory === null ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700'}`}>Todas</button>
      {categories.map((category) => <button key={category} onClick={() => onCategoryChange(category)} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${selectedCategory === category ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700'}`}>{category}</button>)}
    </div>}
  </div>
);
