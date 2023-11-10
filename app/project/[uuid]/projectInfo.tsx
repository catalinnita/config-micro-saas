import { EditableField } from "@/components/EditableField"
import { Flex } from "@chakra-ui/react"

type ProjectInfoProps = {
    projectUuid: string
    name: string
    description: string
    updateProject: ({ uuid, fields }: { uuid: string, fields: Record<string, any> }) => void
}

export function ProjectInfo({
    projectUuid,
    name,
    description,
    updateProject
}: ProjectInfoProps) {
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
                editCallback={(fieldValue: string) => {
                    updateProject({
                        uuid: projectUuid,
                        fields: {
                            name: fieldValue
                        }
                    })
                }} 
            >{name}</EditableField>
            <EditableField 
                editCallback={(fieldValue: string) => {
                    updateProject({
                        uuid: projectUuid,
                        fields: {
                            description: fieldValue
                        }
                    })
                }} 
            >{description}</EditableField>
        </Flex>
    )
}