export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/health-monitoring/:path*",
    "/doctor/:path*",
    "/medical-records/:path*",
    // Protect /admin/* but allow /admin/login through (negative lookahead)
    "/admin/((?!login).*)",
    "/ai-analysis/:path*",
    "/payment/:path*",
    "/speech-analysis/:path*",
  ],
}
