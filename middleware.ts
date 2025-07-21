import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isAuthRouter = createRouteMatcher(["/log-in"]);
const isProtectedRouter = createRouteMatcher(["/"]);

export default convexAuthNextjsMiddleware(async (req, { convexAuth }) => {
  const isAuthenticated = await convexAuth.isAuthenticated();

  if (isAuthRouter(req) && isAuthenticated) {
    return nextjsMiddlewareRedirect(req, "/");
  }

  if (isProtectedRouter(req) && !isAuthenticated) {
    return nextjsMiddlewareRedirect(req, "/log-in");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
