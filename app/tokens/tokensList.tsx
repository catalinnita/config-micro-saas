'use client'

import { DeleteIcon } from "@/components/DeleteIcon/deleteIcon"
import { CreateToken } from "./createToken"
import { useTokens } from "./useTokens"
import { Box, Button, Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react"

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
                        <Td width="1" py={0} px={2}>
                            <Button 
                                onClick={() => { deleteToken({ uuid: token.node.uuid }) }}
                                variant="text" 
                                p={3} 
                                h="auto"
                                cursor="pointer"
                                _hover={{
                                    opacity: "0.6"
                                }}
                            ><DeleteIcon /></Button>
                        </Td>
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