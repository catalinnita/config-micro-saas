import { gql } from '@apollo/client';

export const tokensQuery = gql`
    query tokens($filter: tokensFilter) {
        tokensCollection (
            filter: $filter,
            first: 100, 
            orderBy: [{
                created_at: AscNullsLast
            }]) {
            pageInfo {
                startCursor
                endCursor
                hasPreviousPage
                hasNextPage
            }
            edges {
                node {
                    uuid,
                    teams_uuid,
                }
            }
        }
    }`
