import { addSectionMutation } from "@/data/queries/addSection";
import { deleteSectionMutation } from "@/data/queries/deleteSection";
import { sectionsQuery } from "@/data/queries/sections";
import { updateSectionMutation } from "@/data/queries/updateSection";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useState } from "react";

type useSectionsProps = {
    projectUuid: string
    initialSectionsCollection: any[] // TODO: find a good type for this one
}

export function useSections({
    projectUuid,
    initialSectionsCollection
}: useSectionsProps) {
    const [addSection, { loading, error }] = useMutation(addSectionMutation);
    const [deleteSection] = useMutation(deleteSectionMutation)
    const [updateSection] = useMutation(updateSectionMutation)
    const [ sections, setSections ] = useState(initialSectionsCollection);
    const rowsCount = sections.length;

    const [ refetchSections ] = useLazyQuery(sectionsQuery, {
        ssr: false,
        fetchPolicy: 'no-cache',
        notifyOnNetworkStatusChange: true,
        variables: {
            filter: {
                projects_uuid: { eq: projectUuid }
            }
        },
        onCompleted: (data) => {
            setSections(data.sectionsCollection.edges)
        }
    })

    const createSection = ({teamsUuid} : {teamsUuid: string}) => {
        addSection({
            variables: {
                sectionsInsertInput: {
                    name: 'example section ...',
                    description: 'example sections description',
                    status: 'published',
                    projects_uuid: projectUuid,
                    teams_uuid: teamsUuid
                }
            }
        }).then(res => {
            refetchSections()
        }).catch(err => {
            console.error(err)
        })    
    }

    const removeSection = ({ uuid }: {uuid: string}) => {
        deleteSection({
            variables: {
                sectionsFilter: {
                    uuid: {eq: uuid},
                }
            }
        }).then(() => {
            refetchSections()
        }).catch(err => {
            console.error(err)
        })
    }

    const modifySection = ({ 
        uuid,
        fields,
    }: {
        uuid: string
        fields: Record<string, any>
    }) => {
        updateSection({
            variables: {
                sectionsUpdateInput: fields,
                sectionsFilter: {
                    uuid: {eq: uuid},
                }
            }
        }).then(() => {
            refetchSections()
        }).catch(err => {
            console.error(err)
        })
    }

    return {
        sections,
        loading,
        error,
        addSection: createSection,
        deleteSection: removeSection,
        updateSection: modifySection,
        rowsCount,
    }
}