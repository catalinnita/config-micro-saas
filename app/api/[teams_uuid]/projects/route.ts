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
      const PATH = headers.get('x-pathname')

      // TODO create url and link them to the actual teams_uuid
      // TODO create a wrapper for all routes with the same logic
      const teams_uuid = PATH?.split('/')[2] || ''
      
      if(TOKEN?.includes('Bearer ')) {
        await verifyToken({ 
          token: TOKEN.replace('Bearer ', ''), 
        });

      } else if (TOKEN?.includes('Basic ')) {
        const x = await verifyApiKey({
          key: TOKEN.replace('Basic ', ''),
          teams_uuid,
        })

        const token = generateAccessToken({ teams_uuid });
        const refreshToken = generateRefreshToken({ teams_uuid });

        await addToList({
          teams_uuid, 
          refresher: refreshToken,
        });

        let res = new NextResponse()

        res.cookies.set('jwt', token, {
          httpOnly: true,
        })      
        res.cookies.set('refresh', refreshToken, {
          httpOnly: true,
        })   
                        
        return res
      }
      
      
      // the actual request
      
      // generate the session for this specific user???
      // replace with serverclient
      
      const res = await supabaseAdmin
        .from('projects')
        .select('*')
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
