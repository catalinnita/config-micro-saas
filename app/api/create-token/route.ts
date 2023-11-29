import bcrypt from "bcrypt";
import { NextResponse } from 'next/server';
import { getUser, saveToken } from "@/data/supabase-server";

const generateToken = () => {
    return Array.from(Array(6).keys()).reduce((acc, _) => acc = `${acc}${Math.random().toString(36)}`, '')
}

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
        const { session, userTeams } = await getUser();

        if (!session || !userTeams?.teams_uuid) {
            throw new Error("You are not authorised to access this endpoint.")
        }
        const generatedToken = generateToken()
        const token: string = await new Promise((resolve, reject) => { 
            bcrypt.hash(generatedToken, 10, async function(err?: Error, token?: string) {
                if (!token) {
                   reject("You are not authorised to access this endpoint.")
                }

                resolve(token || '')
            });
        })

        await saveToken({
            token,
            teamsUuid: userTeams?.teams_uuid
        })

        return new NextResponse(JSON.stringify({
            generatedToken
        }), { 
            status: 200 
        });
    } catch(err: any) {
        return new Response(JSON.stringify(err.message), { 
            status: 500 
        });
    }
    
    } else {
        return new Response('Method Not Allowed', {
            headers: { Allow: 'POST' },
            status: 405
        });
    }
}