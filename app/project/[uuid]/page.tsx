import { Project } from './project';
import { getProjectById } from '@/data/apollo-server';
import { AdminWrapper } from '@/components/AdminWrapper';
import { Page } from '@/types/page';
  
type ProjectParams = Page & { 
  uuid: string
}

type ProjectPageProps = {
  params: ProjectParams
}

async function ProjectPage({ params }: ProjectPageProps) {
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
        <Project 
          projectUuid={uuid}
          name={name}
          description={description}
          sectionsCollection={sectionsCollection.edges}
        />
    )
  }

  export default AdminWrapper<ProjectPageProps>(ProjectPage)