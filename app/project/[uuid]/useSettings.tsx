import { addSettingsMutation } from "@/data/queries/addSettings";
import { deleteSettingsMutation } from "@/data/queries/deleteSettings";
import { settingsQuery } from "@/data/queries/settings";
import { updateSettingsMutation } from "@/data/queries/updateSettings";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useState } from "react";

type useSettingsProps = {
    sectionUuid: string
    projectUuid: string
    initialSettingsCollection: any[] // TODO: find a good type for this one
}

export function useSettings({
    sectionUuid,
    projectUuid,
    initialSettingsCollection
}: useSettingsProps) {
    const [addSettings, { loading, error }] = useMutation(addSettingsMutation);
    const [deleteSettings, { loading: deleteSettingsLoading, error: deleteSettingsError }] = useMutation(deleteSettingsMutation);
    const [updateSettings] = useMutation(updateSettingsMutation);
    const [ settings, setSettings ] = useState(initialSettingsCollection);
    const rowsCount = settings.length;

    const [ refetchSettings ] = useLazyQuery(settingsQuery, {
        ssr: false,
        fetchPolicy: 'no-cache',
        notifyOnNetworkStatusChange: true,
        variables: {
            filter: {
                sections_uuid: { eq: sectionUuid }
            }
        },
        onCompleted: (data) => {
            setSettings(data.settingsCollection.edges)
        }
    })

    const createSettings = ({teamsUuid}: {teamsUuid: string}) => {
        addSettings({
            variables: {
                settingsInsertInput: {
                    name: 'example section ...',
                    status: 'published',
                    value: 'example value ...',
                    sections_uuid: sectionUuid,
                    projects_uuid: projectUuid,
                    teams_uuid: teamsUuid
                }
            }
        }).then(res => {
            refetchSettings()
        }).catch(err => {
            console.error(err)
        })    
    }

    const removeSettings = ({uuid}: {uuid: string}) => {
        deleteSettings({
            variables: {
                settingsFilter: {
                    uuid: {eq: uuid},
                }
            }
        }).then(() => {
            refetchSettings()
        }).catch(err => {
            console.error(err)
        })
    }

    const modifySettings = ({ 
        uuid,
        fields,
    }: {
        uuid: string
        fields: Record<string, any>
    }) => {
        updateSettings({
            variables: {
                settingsUpdateInput: fields,
                settingsFilter: {
                    uuid: {eq: uuid},
                }
            }
        }).then(() => {
            refetchSettings()
        }).catch(err => {
            console.error(err)
        })
    }

    return {
        settings,
        loading,
        error,
        addSettings: createSettings,
        deleteSettings: removeSettings,
        updateSettings: modifySettings,
        rowsCount,
    }
}