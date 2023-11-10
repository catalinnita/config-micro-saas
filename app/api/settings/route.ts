import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
   
  if (req.method === 'POST') {
    try {
      const { name } = await req.json()
      const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.SUPABASE_SERVICE_ROLE_KEY || '',
          {
              auth: {
                  autoRefreshToken: false,
                  persistSession: false
              }
          }
      );
      const res = await supabaseAdmin
        .from('settings')
        .select('*')
        .eq('name', name);

        return NextResponse.json({ res })
      } catch (err: any) {
        console.log(err);
        return new Response(
          JSON.stringify({ error: { statusCode: 500, message: err.message } }),
          {
            status: 500
          }
        );
      }
    } else {
      return new Response('Method Not Allowed', {
        headers: { Allow: 'POST' },
        status: 405
      });
    }
       
}
