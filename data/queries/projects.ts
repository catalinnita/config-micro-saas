import { gql } from '@apollo/client';

export const projectsQuery = gql`
  query projects($filter: projectsFilter) {
    projectsCollection (
      filter: $filter,
      first: 100, 
      orderBy: [{
        updated_at: DescNullsLast
      }]) {
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        node {
          uuid,
          name
          description
          created_at
          updated_at
          color
          status
          sectionsCollection (
            orderBy: [{
              updated_at: AscNullsLast
            }]) {
            edges {
              node {
                uuid
                name
                description
                created_at
                updated_at
                status
                settingsCollection (
                  orderBy: [{
                    updated_at: AscNullsLast
                  }]) {
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
        }
      }
    }
  }
`;
