import { Grid } from "@chakra-ui/react"
import { ReactNode } from "react"

type GridWrapperProps = {
    rows: number,
    children: ReactNode
}

export function GridWrapper({
    rows,
    children,
}: GridWrapperProps) {
    return (
        <Grid
            maxW="1280px"
            margin="0 auto"
            gridTemplateColumns="1fr 929px"
            gridTemplateRows={`repeat(${rows+1}, auto)`}
            gridColumnGap={3}
            gridRowGap={3}
          >{children}</Grid>
    )
}