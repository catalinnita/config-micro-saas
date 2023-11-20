import { AdminWrapper } from '@/components/AdminWrapper';
import { getProjects } from "@/data/apollo-server";
import { Projects } from "./projects"

async function DashboardPage() {
  const initialProjects = await getProjects();

  return (
      <>
        {/* <Search /> */}
        <Projects initialProjects={initialProjects} />
      </>
  )
}

export default AdminWrapper(DashboardPage)