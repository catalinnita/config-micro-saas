import { gql } from '@apollo/client';

export const updateSectionMutation = gql`
    mutation($sectionsUpdateInput: sectionsUpdateInput!, $sectionsFilter: sectionsFilter) {
        updatesectionsCollection(
            set: $sectionsUpdateInput,
            filter: $sectionsFilter,
            atMost: 1
        ){
            records {
                uuid
            }
        }
    }`
    