'use client'

import { DeleteIcon } from "@/components/DeleteIcon/deleteIcon"
import { CreateToken } from "./createToken"
import { useTokens } from "./useTokens"
import { Box, Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react"

type TokensListProps = {
    initialTokens: any[],
    teams_uuid: string
}

export function TokensList({
    initialTokens,
    teams_uuid
}: TokensListProps) {
    const {tokens, rowsCount, addToken, deleteToken} = useTokens({
        initialTokens,
        teamUuid: teams_uuid
    })

    return (
        <>
        <TableContainer 
            bg="white"
            borderRadius={10}
        >
            <Table>
                <Tbody>
                {tokens?.map((token: any) => 
                    <Tr>
                        <Td p={3}>{token.node.token}</Td>
                        <Td p={3} onClick={() => { 
                            deleteToken({ uuid: token.node.uuid })
                        }}><DeleteIcon /></Td>
                    </Tr>
                )}
                </Tbody>
            </Table>
        </TableContainer>
        <div></div>
        <Box>
            <CreateToken 
                createTokenCallback={() => {
                    addToken({
                        teamsUuid: teams_uuid
                    })
                }}
            />
        </Box>
        </>
    )
}