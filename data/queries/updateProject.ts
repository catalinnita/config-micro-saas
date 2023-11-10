import { gql } from '@apollo/client';

export const updateProjectMutation = gql`
    mutation($projectsUpdateInput: projectsUpdateInput!, $projectsFilter: projectsFilter) {
        updateprojectsCollection(
            set: $projectsUpdateInput,
            filter: $projectsFilter,
            atMost: 1
        ){
            records {
                uuid
            }
        }
    }`
    