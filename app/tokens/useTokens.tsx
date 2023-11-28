import { addTokenMutation } from "@/data/queries/addToken";
import { deleteTokenMutation } from "@/data/queries/deleteToken";
import { tokensQuery } from "@/data/queries/tokens";
import { postData } from "@/utils/helpers";
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

    const createToken = () => {
        fetch("/api/create-token", {
            method: 'post'
        }).then((res) => {
            console.log({res})
            refetchTokens()
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