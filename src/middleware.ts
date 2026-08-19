import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "mendez_session";

// Chequeo liviano de presencia de cookie (Edge runtime, sin crypto).
// La verificación real de la firma se hace en src/app/admin/layout.tsx y en
// src/app/login/page.tsx, que sí corren en Node y pueden validar el HMAC.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rutas públicas (sin sesión): la tienda online para clientes, sus imágenes y
  // los endpoints de MercadoPago (preferencia + webhook de confirmación).
  if (
    pathname === "/" ||
    pathname === "/store" ||
    pathname.startsWith("/productos") ||
    pathname.startsWith("/ofertas") ||
    pathname.startsWith("/sucursales") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/api/mp") ||
    pathname.startsWith("/api/tienda") ||
    pathname.startsWith("/api/uploads") ||
    pathname.startsWith("/api/track") ||
    pathname.startsWith("/api/coupons")
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

  // OJO: acá NO se redirige /login → /admin cuando hay cookie. El middleware
  // sólo ve que la cookie existe, no si la firma es válida; con una cookie
  // vencida o firmada con otro AUTH_SECRET eso armaba un bucle infinito
  // (/admin → /login → /admin → …) y el panel quedaba inaccesible. La página
  // de login verifica la sesión de verdad y redirige sola si es válida.
  return NextResponse.next();
}

export const config = {
  // `.well-known` queda fuera a propósito: ahí es donde Let's Encrypt pide el
  // archivo del desafío ACME para renovar el certificado. Si el middleware lo
  // redirige a /login, la validación falla y el certificado no se renueva.
  matcher: ["/((?!_next/static|_next/image|brand|favicon.ico|\.well-known).*)"],
};
