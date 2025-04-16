// src/lib/apollo.ts
// Initializes Apollo Client for interacting with the GraphQL backend.

import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: import.meta.env.VITE_API_URL + '/graphql',
  cache: new InMemoryCache(),
})

export default client
