import { gql } from '@apollo/client';

export const addSectionMutation = gql`
    mutation($sectionsInsertInput: sectionsInsertInput!) {
        insertIntosectionsCollection(objects: [$sectionsInsertInput]) {
            records {
                uuid,
                projects_uuid
            }
        }
    }
`;
