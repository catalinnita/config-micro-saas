import { gql } from '@apollo/client';

export const teamsUsersQuery = gql`
    query teams_users($filter: teams_usersFilter) {
        teams_usersCollection (
            filter: $filter,
            first: 100, 
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
                    user_uuid,
                    role,   
                    users {
                        id
                        full_name,
                        avatar_url,
                    }
                }
            }
        }
    }`
