'use client'

import { ProjectInfo } from "./projectInfo";
import { Section } from "./section";
import { useSections } from "./useSections";
import { AddSectionButton } from "./addSectionButton";
import { useProjects } from "@/app/dashboard/useProjects";
import { useUser } from "@/providers/user-provider";
import { GridWrapper } from "@/components/GridWrapper";

type ProjectProps = { 
    projectUuid: string,
    name: string,
    description: string,
    sectionsCollection: any[] // TODO: find a good type for this one
}

export function Project({
    projectUuid,
    name,
    description,
    sectionsCollection,
}: ProjectProps) {
    const { userTeams } = useUser()
    const { updateProject } = useProjects(projectUuid);
    const {addSection, deleteSection, updateSection, sections, rowsCount} = useSections({
        projectUuid,
        initialSectionsCollection: sectionsCollection,
    })

    return (
        <GridWrapper rows={rowsCount}>
            <div></div>
            <ProjectInfo 
                projectUuid={projectUuid}
                name={name}
                description={description}
                updateProject={updateProject}
            />
            {sections.map((section: any) => 
                <Section 
                    key={section.node.uuid}
                    sectionUuid={section.node.uuid}
                    projectUuid={projectUuid}
                    name={section.node.name}
                    description={section.node.description}
                    settingsCollection={section.node.settingsCollection.edges}
                    deleteSection={deleteSection}
                    addSection={() => { addSection({teamsUuid: userTeams.teams_uuid})} }
                    updateSection={updateSection}
                />
            )}
            <AddSectionButton 
                createSectionCallback={() => { 
                    addSection({teamsUuid: userTeams.teams_uuid})
                }}
            />
        </GridWrapper>
    )
}