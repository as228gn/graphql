import gql from 'graphql-tag'

export const userTypeDefs = gql`
 type Mutation {
    registerUser(username: String!, password: String!): User!
    loginUser(username: String!, password: String!): String!
  }
  type User {
    id_user: ID!
    username: String!
  }
`
