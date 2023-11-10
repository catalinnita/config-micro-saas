import { gql } from '@apollo/client';

export const updateTeamsUserMutation = gql`
    mutation($teams_usersUpdateInput: teams_usersUpdateInput!, $teams_usersFilter: teams_usersFilter) {
        updateteams_usersCollection(
            set: $teams_usersUpdateInput,
            filter: $teams_usersFilter,
            atMost: 1
        ){
            records {
                uuid
            }
        }
    }`
    