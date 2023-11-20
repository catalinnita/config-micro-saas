import { Database } from '@/types/db';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const createServerSupabaseClient = cache(() =>
  createServerComponentClient<Database>({ cookies })
);

export async function getSession() {
  const supabase = createServerSupabaseClient();
  try {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getUserDetails() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: userDetails } = await supabase
      .from('users')
      .select('*')
      .single();
    
    const { data: usersTeams } = await supabase
      .from('teams_users')
      .select('*')
      .eq('user_uuid', userDetails?.id || 0)
      .single();

    return {
      ...userDetails,
      teams: usersTeams,
    };
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getUser() {
  const supabase = createServerSupabaseClient();
  try {
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

      return {
        session,
        userDetails,
        userTeams,
      }

    } else {
      throw new Error('Invalid Session')
    }
    
  } catch (error) {
    console.error('Error:', error);
    return {
      session: null,
      userDetails: null,
      userTeams: null,
    };
  }
}

export async function getUserTeams(user_uuid: string) {
  const supabase = createServerSupabaseClient();
  try {
    const { data: userTeams } = await supabase
      .from('teams_users')
      .select('*')
      .eq('user_uuid', user_uuid)

    return userTeams;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getSubscription() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .maybeSingle()
      .throwOnError();

    return subscription;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export const getActiveProductsWithPrices = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};

export const getProjects = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*');

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
}

export const getTeamsUsersInfo = async () => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*');
}
