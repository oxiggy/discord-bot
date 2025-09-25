import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    // biome-ignore lint/style/noNonNullAssertion: validated elsewhere
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: validated elsewhere
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => { request.cookies.set(name, value) })
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            { supabaseResponse.cookies.set(name, value, options) }
          )
        },
      },
    }
  )

  const {
    // biome-ignore lint/correctness/noUnusedVariables: user will be used in future implementation
    data: { user },
  } = await supabase.auth.getUser()

  return supabaseResponse
}