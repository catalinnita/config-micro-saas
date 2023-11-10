import {
    getSession,
    getUserDetails,
    getSubscription,
  } from '@/data/supabase-server';
import { redirect } from 'next/navigation';
import { Project } from './project';
import { getProjectById } from '@/data/apollo-server';
import { AdminWrapper } from '@/components/AdminWrapper';
  
  type ProjectParams = { 
    uuid: string
  }
  
  export default async function ProjectPage({ params }: { params: ProjectParams }) {
    const [session, userDetails, subscription] = await Promise.all([
      getSession(),
      getUserDetails(),
      getSubscription()
    ]);
    
    // check if user is signed-in
    if (!session) {
      return redirect('/signin');
    }

    // TODO: check if user has rights to see the page

    // retrieve SSR data
    const { uuid } = params;
    const project = await getProjectById({
      id: uuid,
    });

    const {
      name,
      description,
      sectionsCollection
    } = project.data.projectsCollection.edges[0].node    

    return (
      <AdminWrapper>
        <Project 
          projectUuid={uuid}
          name={name}
          description={description}
          sectionsCollection={sectionsCollection.edges}
        />
      </AdminWrapper>
    )
  }