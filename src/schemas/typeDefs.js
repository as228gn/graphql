import { gql } from 'graphql-tag'
import { userTypeDefs } from './userSchema.js'
import { movieTypeDefs } from './movieSchema.js'

// Definiera ditt schema genom att kombinera användare och filmtyper
export const typeDefs = gql`
  ${userTypeDefs}
  ${movieTypeDefs}
`

