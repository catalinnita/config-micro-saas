'use client'

import { DeleteIcon } from "@/components/DeleteIcon/deleteIcon"
import { Role } from "./role"
import { Label } from "@/components/Label"
import { Button, Td, Tr } from "@chakra-ui/react"

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
            <Td 
                width="60"
                p={3}
            >
                {name}
            </Td>
            <Td  
                width="5"
                p={3}
            >
                {updateUsersCallback ? 
                    <Role
                        initialRole={role}
                        updateCallback={updateUsersCallback}
                    />: 
                    <Label>{role}</Label>
                }
            </Td>
            <Td></Td>
            {deleteUserCallback && 
                <Td width="1" py={0} px={2}>
                    <Button 
                        onClick={() => { deleteUserCallback() }}
                        variant="text" 
                        p={3} 
                        h="auto"
                        cursor="pointer"
                        _hover={{
                            opacity: "0.6"
                        }}
                    ><DeleteIcon /></Button>
                </Td>    
            }
        </Tr>
    )
}