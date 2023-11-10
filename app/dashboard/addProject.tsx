'use client'

import { Box, Button } from "@chakra-ui/react"

type AddProjectProps = {
    createProjectCallback: () => void
}

export function AddProject({
    createProjectCallback
}: AddProjectProps) {
    return (
        <Button 
            bg="white"
            minHeight={48}
            flexDirection="column"
            justifyContent="space-around"
            borderRadius={8}
            alignItems="center"
            border="3px solid transparent"
            _hover={{
                bg: "white",
                padding: 0,
                transform: 'scale(1.02)'
            }}
            onClick={() => {
                createProjectCallback()
            }}
        >
            <Box 
                fontSize="3xl"
                fontWeight="regular"
            >+</Box>
        </Button>
    )
}