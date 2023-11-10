'use client'

import { DeleteIcon } from "@/components/DeleteIcon/deleteIcon"
import { Role } from "./role"
import { Label } from "@/components/Label"
import { Td, Tr } from "@chakra-ui/react"

type UsersRowProps = {
    user_uuid: string,
    name: string,
    role: 'admin' | 'member'
    status: 'invited' | 'authenticated'
    avatar: string,
    deleteUserCallback?: () => void
    updateUsersCallback?:  ({roleValue}: {roleValue: string}) => void
}

export function UsersRow({
    user_uuid,
    name,
    role,
    status,
    avatar,
    deleteUserCallback,
    updateUsersCallback,
}: UsersRowProps) {
    return (
        <Tr>
            <Td p={3}>
                {name}
            </Td>
            <Td  p={3}>
                {updateUsersCallback ? 
                    <Role
                        initialRole={role}
                        updateCallback={updateUsersCallback}
                    />: 
                    <Label>{role}</Label>
                }
            </Td>
            {deleteUserCallback ? 
                // TO DO: check if the user should be able to detete other users
                <Td  p={3} onClick={() => { 
                    deleteUserCallback()
                }}><DeleteIcon /></Td>:
                <Td></Td>
            }
        </Tr>
    )
}