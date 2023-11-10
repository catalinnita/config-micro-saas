import { Button } from "@chakra-ui/react";

type CreateTokenProps = {
    createTokenCallback: () => void
}

export function CreateToken({
    createTokenCallback
}: CreateTokenProps) {
    return (
        <Button
            onClick={() => {
                createTokenCallback()
            }}
        >Create new token</Button>
    )
}