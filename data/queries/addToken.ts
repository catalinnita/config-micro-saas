import { gql } from '@apollo/client';

export const addTokenMutation = gql`
    mutation($tokensInsertInput: tokensInsertInput!) {
        insertIntotokensCollection(objects: [$tokensInsertInput]) {
            records {
                uuid,
                teams_uuid
            }
        }
    }
`;
