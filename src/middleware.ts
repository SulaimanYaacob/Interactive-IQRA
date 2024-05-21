import { ROLE } from "./utils/constants";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/api/(.*)", "/dummy", "/st/(.*)"],
  afterAuth: (auth, req, evt) => {
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url }) as NextResponse;
    }

    const userRole = auth?.sessionClaims?.role as ROLE;

    if (req.nextUrl.pathname.startsWith("/admin") && userRole !== ROLE.ADMIN) {
      return NextResponse.rewrite(new URL("/404", req.url));
    }

    if (auth.userId && !auth.isPublicRoute) {
      return NextResponse.next();
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
