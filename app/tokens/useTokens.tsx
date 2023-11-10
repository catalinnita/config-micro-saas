import { addTokenMutation } from "@/data/queries/addToken";
import { deleteTokenMutation } from "@/data/queries/deleteToken";
import { tokensQuery } from "@/data/queries/tokens";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useState } from "react";


type useTokensProps = {
    initialTokens: string[]
    teamUuid: string
}

export function useTokens({
    initialTokens,
    teamUuid
}: useTokensProps) {
    const [ tokens, setTokens ] = useState(initialTokens);
    const rowsCount = tokens.length
    const [ addToken ] = useMutation(addTokenMutation);
    const [ deleteToken ] = useMutation(deleteTokenMutation);

    const [ refetchTokens ] = useLazyQuery(tokensQuery, {
        ssr: false,
        fetchPolicy: 'no-cache',
        notifyOnNetworkStatusChange: true,
        variables: {
            filter: {
                teams_uuid: { eq: teamUuid }
            }
        },
        onCompleted: (data) => {
            setTokens(data.tokensCollection.edges)
        }
    })
    const generateToken = () => {
        return Array.from(Array(6).keys()).reduce((acc, _) => acc = `${acc}${Math.random().toString(36)}`, '')
    }
    const createToken = ({teamsUuid} : {teamsUuid: string}) => {
        addToken({
            variables: {
                tokensInsertInput: {
                    token: generateToken(),
                    teams_uuid: teamsUuid
                }
            }
        }).then(res => {
            refetchTokens()
        }).catch(err => {
            console.error(err)
        })    
    }

    const removeToken = ({ uuid }: {uuid: string}) => {
        deleteToken({
            variables: {
                tokensFilter: {
                    uuid: {eq: uuid},
                }
            }
        }).then(() => {
            refetchTokens()
        }).catch(err => {
            console.error(err)
        })
    }

    return {
        tokens,
        addToken: createToken,
        deleteToken: removeToken,
        rowsCount
    }

}