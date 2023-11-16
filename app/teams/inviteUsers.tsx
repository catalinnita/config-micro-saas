import { useSupabase } from "@/providers"
import { postData } from "@/utils/helpers"
import { Input, Button, Flex } from "@chakra-ui/react"
import { useState } from "react"

type InviteUsersProps = {
    teamUuid: string
}

export function InviteUsers({
    teamUuid
}: InviteUsersProps) {
    const { supabase } = useSupabase()
    const [value, setValue] = useState('')

    const sendInvite = async () => {
        // validate email
        // send invite using value and teamUuid
        // create table and see all invited users
        const res = await postData({
            url: '/api/send-invitation',
            data: {
                email: value,
            }
        })
    }

    return (
        <Flex>
            <Input 
                placeholder="Send email invitations"
                mr={2}
                width="75%"
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setValue(e.target.value)
                }}
                type="text" 
                value={value} 
            />
            <Button
                colorScheme="purple"
                onClick={() => {
                    sendInvite()
                }}
            >Invite</Button>
        </Flex>
    )

}