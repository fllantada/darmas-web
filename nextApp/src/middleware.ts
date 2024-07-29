import { NextRequest, NextResponse } from "next/server";
import { runWithAmplifyServerContext } from "@/utils/AmplifyServerUtils";
import { AmplifyServerContextSpec } from "@aws-amplify/core/dist/esm/adapterCore/serverContext/types";
import { fetchAuthSession } from "aws-amplify/auth/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec: AmplifyServerContextSpec) => {
      try {
        // The fetch will grab the session cookies
        /*      const session = await fetchAuthSession(contextSpec, {}); */
        return true;
        /*    return session.tokens !== undefined; */
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return false;
      }
    },
  });

  // If user is authenticated then the route request will continue on
  if (authenticated) {
    return NextResponse.next();
  }

  // If user is not authenticated they are redirected to the /login page
  return NextResponse.redirect(new URL("/login", request.url));
}

// This config will match all routes accept /login, /api, _next/static, /_next/image
// favicon.ico
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|images|favicon.ico|login).*)",
  ],
};
