// src/graphql/queries.ts

import { gql } from '@apollo/client'

export const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      text
      isComplete
    }
  }
`
