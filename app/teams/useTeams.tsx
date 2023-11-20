import { deleteTeamsUserMutation } from "@/data/queries/deleteTeamsUser";
import { teamsUsersQuery } from "@/data/queries/teamsUsers";
import { updateTeamsUserMutation } from "@/data/queries/updateTeamsUser";
import { createServerSupabaseClient, getUserDetails } from "@/data/supabase-server";
import { useLazyQuery, useMutation } from "@apollo/client";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

type useTeamsProps = {
    intialTeamsUsers: string[]
    teamUuid: string
}

export function useTeams({
    intialTeamsUsers,
    teamUuid
}: useTeamsProps) {
    const [ teamsUsers, setTeamsUsers ] = useState(intialTeamsUsers);

    const [ deleteTeamsUsers ] = useMutation(deleteTeamsUserMutation);
    const [ updateTeamsUsers ] = useMutation(updateTeamsUserMutation);

    const rowsCount = teamsUsers.length;

    const [ refetchTeamsUsers ] = useLazyQuery(teamsUsersQuery, {
        ssr: false,
        fetchPolicy: 'no-cache',
        notifyOnNetworkStatusChange: true,
        variables: {
            filter: {
                teams_uuid: { eq: teamUuid }
            }
        },
        onCompleted: (data) => {
            setTeamsUsers(data.teams_usersCollection.edges)
        }
    })

    const removeTeamsUsers = ({users_uuid}: {users_uuid: string}) => {
        deleteTeamsUsers({
            variables: {
                teams_usersFilter: {
                    users_uuid: {eq: users_uuid},
                    teams_uuid: {eq: teamUuid}
                }
            }
        }).then(() => {
            refetchTeamsUsers()
        }).catch(err => {
            console.error(err)
        })
    }

    const modifyTeamsUsers = ({ 
        users_uuid,
        fields,
    }: {
        users_uuid: string
        fields: Record<string, any>
    }) => {
        updateTeamsUsers({
            variables: {
                teams_usersUpdateInput: fields,
                teams_usersFilter: {
                    user_uuid: {eq: users_uuid},
                    teams_uuid: {eq: teamUuid}
                }
            }
        }).then(() => {
            refetchTeamsUsers()
        }).catch(err => {
            console.error(err)
        })
    }

    return {
        teamsUsers,
        // addSettings: createSettings,
        deleteTeamsUsers: removeTeamsUsers,
        updateTeamsUsers: modifyTeamsUsers,
        rowsCount,
    }
}