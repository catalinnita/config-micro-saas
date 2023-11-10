import { Button } from "@chakra-ui/react"

type AddSectionButtonProps = {
    createSectionCallback: () => void
}


export function AddSectionButton({
    createSectionCallback
}: AddSectionButtonProps) {
    return (
        <Button
            onClick={() => {
                createSectionCallback()
            }}
            style={{
                marginTop: '10px',
                backgroundColor: 'gray',
                color: 'black',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                flexDirection: 'column',
                position: 'relative',
                borderRadius: '8px',
                cursor: 'pointer',
            }}
        >+</Button>
    )
}