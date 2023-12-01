// replace password with api-key
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

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

export async function verifyApiKey({key, teams_uuid} : {key: string, teams_uuid: string}) {
    const { data } = await supabaseAdmin
        .from('tokens')
        .select('token')
        .eq('teams_uuid', teams_uuid)
        .order('created_at', { ascending: false })
        .limit(5)
        
    if(!data) {
        throw new Error("invalid api-key")
    }

    const exists = data.some(({ token }) => {
        return bcrypt.compareSync(key.toString().substring(0,77), token)
    })
        
    if (!exists) {
        throw new Error("invalid api-key")
    }

    return true
    
}

export function generateAccessToken({ teams_uuid } : { teams_uuid: string }) {
  return jwt.sign(
    { teams_uuid },
    process.env.SECRET_TOKEN,
    {
      expiresIn: '1h',
    }
  );
}

export function generateRefreshToken({ teams_uuid } : { teams_uuid: string }) {
  return jwt.sign(
    { teams_uuid },
    process.env.SECRET_RTOKEN,
    {
      expiresIn: '30d',
    }
  );
}

export async function addToList({ teams_uuid, refresher } : { teams_uuid: string, refresher: string }) {
  try {
    await supabaseAdmin
        .from('refresh_tokens')
        .insert([{
            teams_uuid,
            token: refresher,
        }])
  } catch (error) {
    console.log(error);
  }
}

export async function tokenRefresh({refreshtoken, res}: {refreshtoken: string, res: NextApiResponse}) {
    try {
        const decoded = jwt.verify(refreshtoken, process.env.SECRET_RTOKEN);

        if (decoded && decoded.teams_uuid) {
            const { data }  = await supabaseAdmin
                .from('refresh_tokens')
                .select('token')
                .order('created_at', { ascending: false })
                .eq('teams_uuid', decoded.teams_uuid)
                .single()

            if (!data) {
                return res.status(401).send("Can't refresh. Invalid Token");
            }

            const {token:rtoken} = data;

            if (rtoken !== refreshtoken) {
                return res.status(401).send("Can't refresh. Invalid Token");
            } else {
                const token = generateAccessToken({
                    teams_uuid: decoded.teams_uuid
                });
                const refreshToken = generateRefreshToken({
                    teams_uuid: decoded.teams_uuid
                });

                await addToList({
                    teams_uuid: decoded.teams_uuid, 
                    refresher: refreshToken
                });

                const content = {
                    teams_uuid: decoded.teams_uuid,
                };
                return {
                    message: 'Token Refreshed',
                    content: content,
                    JWT: token,
                    refresh: refreshToken,
                };
            }
        }
    } catch (error) {
        return res.status(401).send("Can't refresh. Invalid Token");
    }
}

export async function verifyToken({token}: {token: string}) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    return decoded;
  } catch (err) {
    throw new Error("token is invalid")
  }
}