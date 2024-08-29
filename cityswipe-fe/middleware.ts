import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/(.*)', '/match/(.*)', '/explore/(.*)', '/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect()
  }
})

// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware(
    
// );
