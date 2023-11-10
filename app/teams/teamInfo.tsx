'use client'

import { EditableField } from "@/components/EditableField"
import { useUser } from "@/providers/user-provider";
import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

type TeamInfoProps = {
    teams_uuid: string,
    name: string,
    description: string,
}

export function TeamInfo({
    teams_uuid,
    name,
    description
}: TeamInfoProps) {
    const { userTeams } = useUser(); 
    const canEdit = userTeams?.role === 'admin';

    return (
        <Flex
            alignItems="flex-start"
            flexDirection="column"
        >
            <EditableField 
                py={2}
                fontSize="3xl"
                fontWeight="bold"
                lineHeight="none"
                canEdit={canEdit}
                editCallback={() => {}}
            >{name}</EditableField>
            <EditableField 
                canEdit={canEdit}
                editCallback={() => {}}
            >{description}</EditableField>
        </Flex>
    )
}