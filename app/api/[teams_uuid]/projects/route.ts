import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { addToList, generateRefreshToken, verifyToken, generateAccessToken, verifyApiKey } from './utils';

// TODO restrict api by each team url to identify teamid
export async function POST(req: NextRequest) {
  if (req.method === 'POST') {

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

    try {      
      const headers = new Headers(req.headers)

      const TOKEN = headers.get('authorization')
      const APIKEY = headers.get('api-key')
      const PATH = headers.get('x-pathname')

      const teams_uuid = PATH?.split('/')[2] || ''
      
      if(TOKEN) {
        await verifyToken({ 
          token: TOKEN.replace('Bearer ', ''), 
        });

      } else if (APIKEY) {
        await verifyApiKey({
          key: APIKEY,
          teams_uuid,
        })

        const token = generateAccessToken({ teams_uuid });
        const refreshToken = generateRefreshToken({ teams_uuid });

        await addToList({
          teams_uuid, 
          refresher: refreshToken,
        });

        return NextResponse.json({ 
          JWT: token,
          refresh: refreshToken,
        })
      }
      
      // the actual request
      const reqj = await req.json();
      console.log({req: URL})
      const { name } = reqj

      // generate the session for this specific user???
      // replace with serverclient
      
      const res = await supabaseAdmin
        .from('projects')
        .select('*')
        .eq('name', name)
        .eq('teams_uuid', teams_uuid);
        
        return NextResponse.json({ res })

      } catch (err: any) {
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
