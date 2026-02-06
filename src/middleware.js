const AUTH_COOKIE_NAME = "logged_in";

// Paths that logged-in users should be redirected away from
const guestOnlyPaths = ["/login", "/register"];

function isProtected(pathname) {
  return pathname.startsWith("/properties");
}

function isGuestOnly(pathname) {
  return guestOnlyPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function hasAuthCookie(cookieHeader) {
  if (!cookieHeader) return false;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    if (trimmed.slice(0, eq) === AUTH_COOKIE_NAME && trimmed.slice(eq + 1)) return true;
  }
  return false;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get("cookie");
  const loggedIn = hasAuthCookie(cookieHeader);

  // Logged-in user visiting login/register → redirect to properties
  if (loggedIn && isGuestOnly(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/properties";
    return Response.redirect(url);
  }

  // Not logged in and visiting protected route → redirect to login
  if (!loggedIn && isProtected(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return Response.redirect(url);
  }

  return null;
}

export const config = {
  matcher: ["/", "/login", "/register", "/properties", "/properties/new", "/properties/:path*"],
};
