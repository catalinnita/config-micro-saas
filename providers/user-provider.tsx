'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { useSupabase } from "./supabase-provider";

type UserContext = {
    userDetails: any;
    userTeams: any
};

const Context = createContext<UserContext | undefined>(undefined);

export function UserProvider({
    children
  }: {
    children: React.ReactNode;
  }) {
    const [user, setUser] = useState({} as any);
    const { supabase } = useSupabase()

    useEffect(() => {
        const getUserData = async () => {
            const {
                data: { session }
            } = await supabase.auth.getSession();
            
            if (session) {
                const { data: userDetails } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session?.user.id)
                    .single();
                
                const { data: userTeams } = await supabase
                    .from('teams_users')
                    .select('*')
                    .eq('user_uuid', session?.user.id)
                    .single();
                
                setUser({
                    userDetails,
                    userTeams
                })
            }
        }
        getUserData()
    }, [])
        
    return (
    <Context.Provider value={user}>
        {children}
    </Context.Provider>)
}

export const useUser = () => {
    const context = useContext(Context);
  
    if (context === undefined) {
      throw new Error('useUser must be used inside UserProvider');
    }
  
    return context;
  };