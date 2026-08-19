import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { getUsuarioActual } from "@/lib/auth";
import { LoginForm } from "./login-form";

const DotField = dynamic(() => import("@/components/fx/dot-field"));

export default async function LoginPage() {
  // Verificación real de la sesión (firma HMAC + usuario activo). El middleware
  // no puede hacerla en el Edge runtime, así que se hace acá: si la cookie es
  // válida entramos al panel, y si está vencida o mal firmada simplemente se
  // muestra el formulario en vez de rebotar contra /admin en un bucle.
  const usuario = await getUsuarioActual();
  if (usuario) redirect("/admin");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-4 py-10">
      <div className="absolute inset-0">
        <DotField />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(197,237,27,0.14),transparent_55%)]" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
            Repuestos <span className="text-lime">Mendez</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">Hecho por Nicolas Mendez</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-md">
          <h2 className="mb-1 text-lg font-semibold text-white">Iniciar sesión</h2>
          <p className="mb-5 text-xs text-slate-400">Ingresá con tus credenciales para acceder al panel.</p>
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Repuestos Mendez · Hecho por Nicolas Mendez
        </p>
      </div>
    </div>
  );
}
