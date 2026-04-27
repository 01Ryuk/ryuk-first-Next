import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/post/create',
  '/post/:slug/edit',
  '/post/:slug/delete',
]

export async function proxy(request: NextRequest) {
  // Get auth token from cookies
  const token = request.cookies.get('better-auth.session_token')?.value
  const sessionData = request.cookies.get('better-auth.session')?.value

  const { pathname } = request.nextUrl

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => {
    const regex = new RegExp(`^${route.replace(/:[^/]+/g, '[^/]+')}$`)
    return regex.test(pathname)
  })

  // If protected route and no session, redirect to login
  if (isProtectedRoute && !token && !sessionData) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/post/create',
    '/post/:slug/edit',
    '/post/:slug/delete',
  ],
}