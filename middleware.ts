import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isAuthRouter = createRouteMatcher(["/sign-in"]);
// protect all routes except the auth router
const isProtectedRouter = createRouteMatcher(["/profile", "/"]);

export default convexAuthNextjsMiddleware(async (req, { convexAuth }) => {
  const isAuthenticated = await convexAuth.isAuthenticated();

  if (isAuthRouter(req) && isAuthenticated) {
    return nextjsMiddlewareRedirect(req, "/");
  }

  if (isProtectedRouter(req) && !isAuthenticated) {
    return nextjsMiddlewareRedirect(req, "/sign-in");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
