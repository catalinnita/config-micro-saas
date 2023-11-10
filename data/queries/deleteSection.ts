import { gql } from '@apollo/client';

export const deleteSectionMutation = gql`
    mutation($sectionsFilter: sectionsFilter!) {
        deleteFromsectionsCollection(
            filter: $sectionsFilter
            atMost: 100
        ){
            records {
                uuid
            }
        }
    }
`
