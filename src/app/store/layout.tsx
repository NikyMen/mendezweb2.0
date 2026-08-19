import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tienda online · Repuestos Mendez",
  description: "Comprá online y pagá con MercadoPago.",
};

// Layout público de la tienda: sin sidebar ni auth (usa el root layout para
// fuentes y estilos globales).
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4">
          <Link href="/store" className="flex flex-col leading-tight">
            <span className="font-display text-lg font-bold uppercase text-navy">Repuestos Mendez</span>
            <span className="text-[11px] text-slate-500">Hecho por Nicolas Mendez</span>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
