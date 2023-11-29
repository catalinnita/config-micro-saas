import { deleteTokenMutation } from "@/data/queries/deleteToken";
import { tokensQuery } from "@/data/queries/tokens";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

type useTokensProps = {
    initialTokens: string[]
    teamUuid: string
}

export function useTokens({
    initialTokens,
    teamUuid
}: useTokensProps) {
    const [ viewableToken, setViewableToken ] = useState('');
    const [ tokens, setTokens ] = useState(initialTokens);
    const [ parsedTokens, setParsedTokens ] = useState([] as any)
    const rowsCount = tokens.length
    const [ deleteToken ] = useMutation(deleteTokenMutation);
    const fakeToken = '******** '.repeat(5)

    useEffect(() => {
        setParsedTokens(tokens.map((token: any, index) => {
            token.node.token = viewableToken && index === tokens.length - 1 ?
                        viewableToken : fakeToken
    
            return token
        }))
    }, [tokens])

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

    const createToken = () => {
        fetch("/api/create-token", {
            method: 'post'
        }).then((res: any) => {
            return res.json()
        }).then((res: any) => {
            refetchTokens()
            const { generatedToken } = res;
            setViewableToken(generatedToken)
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
        rowsCount,
        viewableToken,
        parsedTokens
    }

}