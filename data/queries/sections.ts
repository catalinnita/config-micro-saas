import { gql } from '@apollo/client';

export const sectionsQuery = gql`
  query settings($filter: sectionsFilter) {
    sectionsCollection (
        filter: $filter,
        first: 100, 
        orderBy: [{
          updated_at: AscNullsLast
        }]) {
        pageInfo {
            startCursor
            endCursor
            hasPreviousPage
            hasNextPage
        }
        edges {
          node {
            uuid
            name
            description
            created_at
            updated_at
            status
            settingsCollection {
                edges {
                  node {
                    uuid
                    name
                    created_at
                    updated_at
                    value
                    type
                    status
                  }
                }
              }
          }
        }
    }
  }`
