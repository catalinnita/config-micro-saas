import { SectionInfo } from "./sectionInfo"
import { Settings } from "./settings"
import { SectionMenu } from "./sectionMenu"
import { Box, Flex } from "@chakra-ui/react"

type SectionProps = {
    projectUuid: string
    sectionUuid: string
    name: string
    description: string
    settingsCollection: any[] // TODO: find a good type for this one
    deleteSection: ({ uuid }: { uuid: string }) => void
    addSection: () => void
    updateSection: ({ uuid, fields }: { uuid: string, fields: Record<string, any> }) => void
}

export function Section({
    projectUuid,
    sectionUuid,
    name,
    description,
    settingsCollection,
    deleteSection,
    addSection,
    updateSection,
}: SectionProps) {
    return (
        <>
            <Box 
                position="relative"
            >
                <SectionInfo 
                    sectionUuid={sectionUuid}
                    name={name}
                    description={description}
                    updateSection={updateSection}
                />
                <SectionMenu 
                    deleteSection={() => {
                        deleteSection({uuid: sectionUuid})
                    }}
                />
            </Box>
            <Settings
                initialSettings={settingsCollection}  
                sectionUuid={sectionUuid} 
                projectUuid={projectUuid}
            />
        </>
    )
}