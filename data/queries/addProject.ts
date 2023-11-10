import { gql } from '@apollo/client';

export const addProjectMutation = gql`
    mutation($projectsInsertInput: projectsInsertInput!) {
        insertIntoprojectsCollection(objects: [$projectsInsertInput]) {
            records {
                uuid
            }
        }
    }
`
