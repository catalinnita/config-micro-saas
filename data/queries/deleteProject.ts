import { gql } from '@apollo/client';

export const deleteProjectMutation = gql`
    mutation($projectsFilter: projectsFilter!) {
        deleteFromprojectsCollection(
            filter: $projectsFilter
            atMost: 100
        ){
            records {
                uuid
            }
        }
    }
`