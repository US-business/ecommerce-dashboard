import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const locales = ["ar", "en"];
const defaultLocale = "ar";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard"];

// Routes that require super_admin role
const adminRoutes = [
  "/dashboard/products",
  "/dashboard/categories",
  "/dashboard/coupons",
  "/dashboard/orders",
  "/dashboard/gallery"
];

function getLocale(request: NextRequest): string {
  const preferredLocale = request.cookies.get('preferred-locale')?.value;
  if (preferredLocale && locales.includes(preferredLocale)) {
    return preferredLocale;
  }

  // Return default locale (Arabic) when no preference is saved
  // This ensures the app starts with Arabic as the default language
  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /ar/products
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

  // Check authentication for protected routes
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET
  });

  // Extract the path without locale
  const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, "");

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );

  // Redirect to signin if accessing protected route without auth
  if (isProtectedRoute && !token) {
    const locale = pathname.split('/')[1] || defaultLocale;
    const signInUrl = new URL(`/${locale}/signin`, request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check admin role for admin routes
  if (isAdminRoute && token?.role !== "super_admin") {
    const locale = pathname.split('/')[1] || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};