import { updateUserMutation } from "@/data/queries/updateUser"
import { getUser } from "@/data/supabase-server";
import { useMutation } from "@apollo/client"

type userIdProps = {
    userId: string,
}

export function useUsers({
    userId
}: userIdProps) {
    const [ updateUsers ] = useMutation(updateUserMutation)

    const modifyUsers = ({ 
        fields,
    }: {
        fields: Record<string, any>
    }) => {
        updateUsers({
            variables: {
                teams_usersUpdateInput: fields,
                teams_usersFilter: {
                    id: {eq: userId},
                }
            }
        }).catch(err => {
            console.error(err)
        })
    }

    return {
        updateUsers: modifyUsers,
    }
}