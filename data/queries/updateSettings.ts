import { gql } from '@apollo/client';

export const updateSettingsMutation = gql`
    mutation($settingsUpdateInput: settingsUpdateInput!, $settingsFilter: settingsFilter) {
        updatesettingsCollection(
            set: $settingsUpdateInput,
            filter: $settingsFilter,
            atMost: 1
        ){
            records {
                uuid
            }
        }
    }`
    