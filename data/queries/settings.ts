import { gql } from '@apollo/client';

export const settingsQuery = gql`
  query settings($filter: settingsFilter) {
    settingsCollection (
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
            created_at
            updated_at
            value
            type
            status
          }
        }
    }
  }`
