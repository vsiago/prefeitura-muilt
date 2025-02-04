import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas públicas que não precisam de autenticação
const publicRoutes = ["/login", "/register", "/about"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("user")?.value; // Pegando o token salvo nos cookies
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  // Se o usuário não estiver autenticado e tentar acessar uma rota protegida
  if (!token && !isPublicRoute) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // Se o usuário já estiver autenticado e tentar acessar login ou register, redireciona para home
  if (token && isPublicRoute) {
    const url = new URL("/home", request.url);
    return NextResponse.redirect(url);
  }

  // Impedir cache para evitar exibição estática
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  return response;
}

// Aplica o middleware a todas as rotas, exceto APIs e arquivos estáticos
export const config = {
  matcher: "/((?!_next|api|static|favicon.ico).*)",
};
