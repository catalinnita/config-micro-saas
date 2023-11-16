import { Button } from "@chakra-ui/react";

type CreateTokenProps = {
    createTokenCallback: () => void
}

export function CreateToken({
    createTokenCallback
}: CreateTokenProps) {
    return (
        <Button
            colorScheme="purple"
            onClick={() => {
                createTokenCallback()
            }}
        >Create new token</Button>
    )
}