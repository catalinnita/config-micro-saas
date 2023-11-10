import { gql } from '@apollo/client';

export const deleteTokenMutation = gql`
    mutation($tokensFilter: tokensFilter!) {
        deleteFromtokensCollection(
            filter: $tokensFilter
            atMost: 1
        ){
            records {
                uuid
            }
        }
    }
`
