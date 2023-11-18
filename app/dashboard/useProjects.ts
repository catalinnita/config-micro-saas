import { projectsColors } from "@/config/projectsColors";
import { addProjectMutation } from "@/data/queries/addProject";
import { addSectionMutation } from "@/data/queries/addSection";
import { addSettingsMutation } from "@/data/queries/addSettings"
import { deleteProjectMutation } from "@/data/queries/deleteProject";
import { deleteSectionMutation } from "@/data/queries/deleteSection";
import { deleteSettingsMutation } from "@/data/queries/deleteSettings";
import { projectsQuery } from "@/data/queries/projects";
import { updateProjectMutation } from "@/data/queries/updateProject";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

function createNewProject({
    addProject,
    addSection,
    addSettings,
    refetchProjects,
    setToEdit,
    teamsUuid
}: any) {
    const randomIndex = Math.floor(Math.random() * (projectsColors.length - 1))
    const randomColor = projectsColors[randomIndex];

    addProject({
        variables: {
            projectsInsertInput: {
                name: 'example project',
                description: 'example project description',
                color: randomColor,
                status: 'published',
                teams_uuid: teamsUuid
            }
        }
    }).then((res: any) => {
        addSection({
            variables: {
                sectionsInsertInput: {
                    name: 'example section',
                    description: 'example section description',
                    status: 'published',
                    projects_uuid: res.data.insertIntoprojectsCollection.records[0].uuid,
                    teams_uuid: teamsUuid
                }
            }
        }).then((res: any) => {
            addSettings({
                variables: {
                    settingsInsertInput: {
                        name: 'example settings',
                        type: 'string',
                        value: 'example value',
                        status: 'published',
                        sections_uuid: res.data.insertIntosectionsCollection.records[0].uuid,
                        projects_uuid: res.data.insertIntosectionsCollection.records[0].projects_uuid,
                        teams_uuid: teamsUuid
                    }
                }
            }).then((res: any) => {
                refetchProjects()
                setToEdit(res.data.insertIntosettingsCollection.records[0].projects_uuid)
            })
        })
    })
}

function deleteAllProject({
    projects_uuid,
    deleteProject,
    deleteSection,
    deleteSettings,
    refetchProjects,
}: any) {
    deleteSettings({
        variables: {
            settingsFilter: {
                projects_uuid: {eq: projects_uuid},
            }
        }
    }).then(() => {
        deleteSection({
            variables: {
                sectionsFilter: {
                    projects_uuid: {eq: projects_uuid},
                }
            }
        }).then(() => {
            deleteProject({
                variables: {
                    projectsFilter: {
                        uuid: {eq: projects_uuid},
                    }
                }
            }).then(() => {
                refetchProjects()
            })
        })
    })
}

function updateTheProject({
    uuid,
    fields,
    updateProject,
    refetchProjects,
    setToEdit,
}: {
    uuid: string,
    fields: Record<string, any>,
    updateProject: any,
    refetchProjects: () => void,
    setToEdit: any
}) {
    updateProject({
        variables: {
            projectsUpdateInput: fields,
            projectsFilter: {
                uuid: {eq: uuid},
            }
        }
    }).then(() => {
        refetchProjects();
        setToEdit(null)
    })
}

export function useProjects({
    initialProjects,
    teamsUuid
}: any) {
    const [ projects, setProjects ] = useState(initialProjects);
    const [ toEdit, setToEdit ] = useState(null)

    const [addProject, { data: projectData, loading: projectLoading, error: projectError }] = useMutation(addProjectMutation);
    const [updateProject, { data: projectUpdateData, loading: projectUpdateLoading, error: projectUpdateError }] = useMutation(updateProjectMutation);
    const [deleteProject, { data: projectDeleteData, loading: projectDeleteLoading, error: projectDeleteError }] = useMutation(deleteProjectMutation);

    //TO DO: reuse the existing hooks rather than useMutation directly
    const [addSection, { data: sectionData, loading: sectionLoading, error: sectionError }] = useMutation(addSectionMutation);
    const [deleteSection, { data: sectionDeleteData, loading: sectionDeleteLoading, error: sectionDeleteError }] = useMutation(deleteSectionMutation);
    
    const [addSettings, { data: settingsData, loading: settingsLoading, error: settingsError }] = useMutation(addSettingsMutation);
    const [deleteSettings, { data: settingsDeleteData, loading: settingsDeleteLoading, error: settingsDeleteError }] = useMutation(deleteSettingsMutation);


    const [refetchProjects, { 
        loading: projectsLoading, 
        error: projectsError, 
        data: projectList,
    }] = useLazyQuery(projectsQuery, {
        ssr: false,
        fetchPolicy: 'no-cache',
        notifyOnNetworkStatusChange: true,
        onCompleted: (data) => {
            setProjects({ data })
        }
    })

    return {
        createNewProject: () => {
            createNewProject({ 
                addProject, 
                addSection, 
                addSettings, 
                refetchProjects,
                setToEdit,
                teamsUuid,
            })
        },
        toEdit,
        createNewProjectLoading: projectLoading || sectionLoading || settingsLoading,
        createNewProjecSuccess: projectData && sectionData && settingsData,
        createNewProjectError: projectError || sectionError || settingsError,
        
        deleteProject: ({ uuid }: any) => {
            deleteAllProject({
                deleteProject, 
                deleteSection, 
                deleteSettings, 
                refetchProjects,
                projects_uuid: uuid,
            })
        },

        updateProject: ({ uuid, fields }: {uuid: string, fields: Record<string, any>}) => { 
            updateTheProject({
                uuid,
                fields,
                updateProject,
                refetchProjects,
                setToEdit,
            }) 
        },

        addSettings,

        projects,
    }

}