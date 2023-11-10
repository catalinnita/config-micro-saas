import { Flex } from "@chakra-ui/react"
import { EditableField } from "../../../components/EditableField/EditableField"

type SectionInfoProps = {
    sectionUuid: string,
    name: string,
    description: string,
    updateSection: ({ uuid, fields }: { uuid: string, fields: Record<string, any> }) => void,
}

export function SectionInfo({
    sectionUuid,
    name,
    description,
    updateSection,
}: SectionInfoProps) {

    return (
        <Flex
            flexDirection="column"
            alignItems="flex-start"
        >
            <EditableField 
                fontSize="xl"
                lineHeight="none"
                fontWeight="bold"
                py={2}
                editCallback={(fieldValue: string) => {
                    updateSection({
                        uuid: sectionUuid,
                        fields: {
                            name: fieldValue
                        }
                    })
                }}>{name}</EditableField>
            <EditableField 
                editCallback={(fieldValue: string) => {
                    updateSection({
                        uuid: sectionUuid,
                        fields: {
                            description: fieldValue
                        }
                    })
                }}>{description}</EditableField>
        </Flex>
    )
}