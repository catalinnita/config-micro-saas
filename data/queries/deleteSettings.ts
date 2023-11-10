import { gql } from '@apollo/client';

export const deleteSettingsMutation = gql`
    mutation($settingsFilter: settingsFilter!) {
        deleteFromsettingsCollection(
            filter: $settingsFilter
            atMost: 100
        ){
            records {
                uuid
            }
        }
    }
`
