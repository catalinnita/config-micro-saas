import { gql } from '@apollo/client';

export const teamsQuery = gql`
    query teams($filter: teamsFilter) {
        teamsCollection (
            filter: $filter,
            first: 1, 
        ) {
            pageInfo {
                startCursor
                endCursor
                hasPreviousPage
                hasNextPage
            }
            edges {
                node {
                    uuid,
                    name,
                    description,
                }
            }
        }
    }`
