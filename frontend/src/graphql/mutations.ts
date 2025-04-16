// src/graphql/mutations.ts

import { gql } from '@apollo/client'

export const ADD_TODO = gql`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
      text
      isComplete
    }
  }
`

export const COMPLETE_TODO = gql`
  mutation CompleteTodo($id: String!) {
    completeTodo(id: $id) {
      id
      isComplete
    }
  }
`

export const TRASH_TODO = gql`
  mutation TrashTodo($id: String!) {
    trashTodo(id: $id) {
      id
    }
  }
`
