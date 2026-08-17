import { cn } from "@/lib/cn";

/** Marca textual hasta disponer del logo oficial de Repuestos Méndez. */
export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <div className={cn("flex h-10 w-[212px] items-center rounded-lg bg-brand-ink px-3", className)}>
      <span className={cn("text-base font-extrabold tracking-tight", dark ? "text-white" : "text-brand-gold")}>
        Repuestos Méndez
      </span>
    </div>
  );
}
