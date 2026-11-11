import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { connection } from 'next/server'

export async function createClient() {
  // Supabase auth reads the current time; initialize it only at request time.
  await connection()
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method can be called from a Server Component or Route Handler.
            // The cookie store may be read-only if the request is being handled outside of a
            // standard browser-style cookie context, so we ignore that case here.
          }
        },
      },
    }
  )
}
