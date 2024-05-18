import { ROLE } from "./utils/constants";
import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/api/(.*)", "/dummy", "/st/(.*)"],
  afterAuth: (auth, req, evt) => {
    const userRole = auth?.sessionClaims?.role as ROLE;

    if (req.nextUrl.pathname.startsWith("/admin") && userRole !== ROLE.ADMIN) {
      return NextResponse.rewrite(new URL("/404", req.url));
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
