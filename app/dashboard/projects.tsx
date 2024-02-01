'use client'

import { ProjectCard } from "@/components/ProjectCard/ProjectCard"
import { AddProject } from "./addProject"
import { useProjects } from "./useProjects"
import { useUser } from "@/providers/user-provider"
import { Grid } from "@chakra-ui/react"

const calculateSettingsCount = (project: any): number => {
    return project.node.sectionsCollection.edges.reduce((acc: any, curr: any) => {
        return acc = acc + curr.node.settingsCollection.edges.length
    }, 0)
}

type ProjectsProps = {
    initialProjects: Project[]
}

export function Projects({
    initialProjects
}: ProjectsProps) {
    const { userTeams } = useUser()

    const { 
        projects, 
        createNewProject, 
        deleteProject, 
        updateProject, 
        toEdit 
    } = useProjects({ 
        initialProjects,
        teamsUuid: userTeams?.teams_uuid 
    });

    const { data: projectsList } = projects;

    const columns = (nr: number) => `repeat(${nr}, calc(${Math.floor(100/nr)}% - 24px * ${nr-1} / ${nr}))`
    const responsponsiveColumns = [
        columns(2),
        columns(3),
        columns(3),
        columns(4),
    ]
    return (
        <Grid 
            maxW="container.xl" 
            gridTemplateColumns={responsponsiveColumns} 
            gap={6}
            pb={6}
        >
            {projectsList?.projectsCollection?.edges?.map((project: Project) => 
                    <ProjectCard 
                        focus={project.node.uuid === toEdit}
                        key={project.node.uuid}
                        uuid={project.node.uuid}
                        name={project.node.name}
                        settingsCount={calculateSettingsCount(project)}
                        color={project.node.color}
                        updateProject={updateProject}
                        deleteProject={() => { deleteProject({
                            uuid: project.node.uuid
                        }) }}
                    />
                )}
                
            <AddProject 
                createProjectCallback={createNewProject}
            />
        </Grid>
    )
}