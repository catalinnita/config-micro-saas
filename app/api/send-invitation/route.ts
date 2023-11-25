import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
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
            const { email, teamUuid } = await req.json();
            const res = await supabaseAdmin.auth.admin.inviteUserByEmail(email)
            
            // add email as temp name
            await supabaseAdmin
              .from('users')
              .update({ full_name: email })
              .eq('id', res?.data?.user?.id)
              .select()

            // assign user to a team
            await supabaseAdmin
              .from('teams_users')
              .insert([
                { teams_uuid: teamUuid,
                  user_uuid: res?.data?.user?.id, 
                  role: 'member' },
              ])
              .select()

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
