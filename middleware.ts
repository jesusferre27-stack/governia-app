import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // 1. Permitir siempre el callback de auth
  if (pathname.startsWith("/auth/callback")) return response;

  // 2. Permitir siempre las páginas de login para evitar bucles
  if (pathname.includes("/login")) return response;

  // 3. Proteger rutas de ciudadano
  if (pathname.startsWith("/citizen") && !session) {
    url.pathname = "/citizen/login";
    return NextResponse.redirect(url);
  }

  // 4. Proteger rutas de staff
  if (pathname.startsWith("/staff") && !session) {
    url.pathname = "/staff/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
