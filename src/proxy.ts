import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const adminPublicPaths = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];
  const patientPublicPaths = ["/paciente/login", "/paciente/forgot-password", "/paciente/reset-password"];

  if (pathname.startsWith("/admin") && !adminPublicPaths.includes(pathname)) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const { data: staff } = await supabase
      .from("staff")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!staff) {
      return NextResponse.redirect(new URL("/admin/login?error=No+autorizado", request.url));
    }
  }

  if (
    pathname.startsWith("/paciente") &&
    !patientPublicPaths.includes(pathname) &&
    !user
  ) {
    return NextResponse.redirect(new URL("/paciente/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/paciente/:path*"],
};
