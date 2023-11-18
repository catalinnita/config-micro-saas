"use client"

import { useUser } from "@/providers/user-provider"
import { InviteUsers } from "./inviteUsers"
import { UsersRow } from "./teamUsersRow"
import { useTeams } from "./useTeams"
import { Box, Table, TableContainer, Tbody } from "@chakra-ui/react"

type TeamUsersProps = {
    teamUuid: string
    users: any[]
}

export function TeamUsers({
    teamUuid,
    users
}: TeamUsersProps) {
    const { userTeams } = useUser()
    const { teamsUsers, rowsCount, deleteTeamsUsers, updateTeamsUsers } = useTeams({
        intialTeamsUsers: users,
        teamUuid
    })

    console.log({
        userTeams
    });

    return (
        <TableContainer 
            bg="white"
            borderRadius={10}
        >
            <Table>
                <Tbody>

                    {users.map((user: any) => <UsersRow 
                        key={user.node.user_uuid}
                        user_uuid={user.node.user_uuid}
                        name={user.node.users.full_name}
                        avatar={user.node.users.avatar_url}
                        role={user.node.role}
                        status={user.node.status}
                        deleteUserCallback={userTeams?.role === 'admin' && userTeams.user_uuid !== user.node.user_uuid  ? () => { 
                            deleteTeamsUsers({
                                users_uuid: user.node.user_uuid
                            })
                        }: undefined}
                        updateUsersCallback={userTeams?.role === 'admin' && userTeams.user_uuid !== user.node.user_uuid ? ({roleValue}) => {
                            updateTeamsUsers({
                                users_uuid: user.node.user_uuid,
                                fields: {
                                    role: roleValue
                                }
                            })
                        }: undefined}
                    />)}

                </Tbody>
            </Table>
            <Box p={3}>
                {userTeams?.role === 'admin' && <InviteUsers 
                    teamUuid={teamUuid}
                />}
            </Box>
        </TableContainer>
    )
}