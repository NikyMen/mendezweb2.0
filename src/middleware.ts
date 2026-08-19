import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "gestoria_session";

// Chequeo liviano de presencia de cookie (Edge runtime, sin crypto).
// La verificación real de la firma se hace en src/app/admin/layout.tsx.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rutas públicas (sin sesión): la tienda online para clientes y los endpoints
  // de MercadoPago (creación de preferencia + webhook de confirmación).
  if (
    pathname === "/" ||
    pathname === "/store" ||
    pathname.startsWith("/productos") ||
    pathname.startsWith("/ofertas") ||
    pathname.startsWith("/sucursales") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/api/mp") ||
    pathname.startsWith("/api/tienda")
  ) {
    return NextResponse.next();
  }

  const hasCookie = Boolean(req.cookies.get(COOKIE)?.value);
  const isLogin = pathname === "/login";

  if (!hasCookie && !isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (hasCookie && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // `.well-known` queda fuera a propósito: ahí es donde Let's Encrypt pide el
  // archivo del desafío ACME para renovar el certificado. Si el middleware lo
  // redirige a /login, la validación falla y el certificado no se renueva.
  matcher: ["/((?!_next/static|_next/image|brand|favicon.ico|\\.well-known).*)"],
};
