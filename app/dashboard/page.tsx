import {
  getSession,
  getUserDetails,
  getSubscription,
} from '@/data/supabase-server';
import { redirect } from 'next/navigation';
import { Projects } from './projects';
import { Search } from './search';
import { getProjects } from '@/data/apollo-server';
import { AdminWrapper } from '@/components/AdminWrapper';

export default async function Dashboard() {
  const [session, userDetails, subscription] = await Promise.all([
    getSession(),
    getUserDetails(),
    getSubscription()
  ]);

  if (!session) {
    return redirect('/signin');
  }

  const projects = await getProjects();

  return (
    <AdminWrapper>
      {/* <Search /> */}
      <Projects initialProjects={projects} />
    </AdminWrapper>
  )

}