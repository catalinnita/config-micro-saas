import { gql } from '@apollo/client';

export const updateUserMutation = gql`
    mutation($usersUpdateInput: usersUpdateInput!, $usersFilter: usersFilter) {
        updateusersCollection(
            set: $usersUpdateInput,
            filter: $usersFilter,
            atMost: 1
        ){
            records {
                id
            }
        }
    }`
    