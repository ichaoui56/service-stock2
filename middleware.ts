import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // All protected routes require authentication
        return !!token
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/sales/:path*",
    "/purchases/:path*",
    "/categories/:path*",
    "/reports/:path*",
  ],
}