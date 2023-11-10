import { gql } from '@apollo/client';

export const addSettingsMutation = gql`
    mutation($settingsInsertInput: settingsInsertInput!) {
        insertIntosettingsCollection(objects: [$settingsInsertInput]) {
            records {
                projects_uuid,
                uuid
            }
        }
    }
`;
