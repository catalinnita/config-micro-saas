import {
    getUser,
  } from '@/data/supabase-server';
  import { redirect } from 'next/navigation';
import { Team } from './team';
import { AdminWrapper } from '@/components/AdminWrapper';

  export default async function TeamsPage() {
    const { session, userDetails, userTeams } = await getUser();

    // check if user is signed-in
    if (!session) {
      return redirect('/signin');
    }

    // TODO: check if user has rights to see the page
    
    return (
      <AdminWrapper>
          {userTeams?.teams_uuid && 
            <Team 
              teams_uuid={userTeams?.teams_uuid}
            />
          }
      </AdminWrapper>
    )
  
  }