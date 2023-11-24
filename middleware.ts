import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/types/db'

export async function middleware(req: NextRequest) {
  
  const url = new URL(req.url);
  const origin = url.origin;
  const pathname = url.pathname;
  const requestHeaders = new Headers(req.headers);

  // console.log(req.headers)

  requestHeaders.set('x-url', req.url);
  requestHeaders.set('x-origin', origin);
  requestHeaders.set('x-pathname', pathname);
  
  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  })

  const supabase = createMiddlewareClient<Database>({ req, res })
  await supabase.auth.getSession()
  
  return res
}