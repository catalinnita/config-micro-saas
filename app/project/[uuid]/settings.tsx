'use client'

import { DeleteIcon } from "@/components/DeleteIcon/deleteIcon"
import { useSettings } from "./useSettings"
import { EditableField } from "@/components/EditableField"
import { Status } from "./status"
import { useUser } from "@/providers/user-provider"
import { Button, Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react"

type SettingsProps = {
    initialSettings: any[]
    sectionUuid: string
    projectUuid: string
}

type SettingsRowProps = {
    settingsUuid: string,
    name: string
    type: string
    value: string
    status: 'published' | 'draft' | 'disabled'
    deleteSettingsCallback: () => void,
    updateSettingsCallback: ({ uuid, fields }: { uuid: string, fields: Record<string, any> }) => void,
}

export function SettingsRow({
    settingsUuid,
    name,
    type,
    value,
    status,
    deleteSettingsCallback,
    updateSettingsCallback
}: SettingsRowProps) {
    return (
        <Tr>
            <Td p={3}>
                <EditableField editCallback={(fieldValue: string) => {
                    updateSettingsCallback({
                        uuid: settingsUuid,
                        fields: {
                            name: fieldValue
                        }
                    })
                }}>{name}</EditableField>
            </Td>

            <Td p={3}>
                <Status
                    updateCallback={({statusValue}) => {
                        updateSettingsCallback({
                            uuid: settingsUuid,
                            fields: {
                                status: statusValue
                            }
                        })
                    }}
                    initialStatus={status}
                />
            </Td>
            
            <Td 
                p={3} 
                fontSize="sm"
                fontWeight="medium"
            >{type}</Td>
            
            <Td p={3}>
                <EditableField editCallback={(fieldValue: string) => {
                    updateSettingsCallback({
                        uuid: settingsUuid,
                        fields: {
                            value: fieldValue
                        }
                    })
                }}>{value}</EditableField>
            </Td>
            
            <Td p={3} onClick={() => { deleteSettingsCallback() }}><DeleteIcon /></Td>
        </Tr>
    )
}


type AddSettingsButtonProps = {
    createSettingsCallback: () => void
}

export function AddSettingsButton({
    createSettingsCallback
}: AddSettingsButtonProps) {
    return (
        <Button
            onClick={() => {
                createSettingsCallback()
            }}
            variant="outline"
            m={3}
            w="100px"
            size="sm"
        >+</Button>
    )
}

export function Settings({
    initialSettings,
    sectionUuid,
    projectUuid,
}: SettingsProps) {
    const { userTeams } = useUser()
    const { settings, addSettings, deleteSettings, updateSettings, rowsCount } = useSettings({
        initialSettingsCollection: initialSettings,
        sectionUuid,
        projectUuid,
    })

    return (
        <TableContainer 
            bg="white"
            borderRadius={10}
        >
            <Table>
                <Tbody>
                    {settings.map((setting: any) => <SettingsRow 
                        settingsUuid={setting.node.uuid}
                        key={setting.node.uuid}
                        name={setting.node.name}
                        status={setting.node.status}
                        type={setting.node.type}
                        value={setting.node.value}
                        deleteSettingsCallback={() => { 
                            deleteSettings({
                                uuid: setting.node.uuid
                            })
                        }}
                        updateSettingsCallback={updateSettings}
                    />)}
                </Tbody>
            </Table>
            <AddSettingsButton 
                createSettingsCallback={() => {
                    addSettings({
                        teamsUuid: userTeams.teams_uuid
                    })
                }}
            />
        </TableContainer>
    )
}