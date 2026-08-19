import Image from "next/image";
import { cn } from "@/lib/cn";

/** Logo de Repuestos Mendez usado por la tienda pública. */
export function Logo({ className }: { className?: string; dark?: boolean }) {
  return <Image src="/logo-lcimports.svg" alt="Repuestos Mendez" width={180} height={50} priority unoptimized className={cn("h-11 w-auto", className)} />;
}
