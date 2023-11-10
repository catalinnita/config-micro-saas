import { getTokensById } from "@/data/apollo-server"
import { TokensList } from "./tokensList"
import { GridWrapper } from "@/components/GridWrapper"

type TokensProps = {
    teams_uuid: string
}

export async function Tokens({
    teams_uuid
}: TokensProps) {
    const tokens = await getTokensById({
        teams_uuid: teams_uuid
    })
    const rowsCount = tokens?.length
    return (
        <GridWrapper rows={1}>
            <div></div>
            <TokensList 
                initialTokens={tokens}
                teams_uuid={teams_uuid}
            />
        </GridWrapper>
    )
}