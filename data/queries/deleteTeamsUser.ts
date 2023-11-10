import { gql } from '@apollo/client';

export const deleteTeamsUserMutation = gql`
    mutation($teams_usersFilter: teams_usersFilter!) {
        deleteFromteams_usersCollection(
            filter: $teams_usersFilter
            atMost: 1
        ){
            records {
                uuid
            }
        }
    }
`
