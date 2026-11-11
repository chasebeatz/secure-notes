import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/login' || pathname === '/signup') {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (!error && user) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
