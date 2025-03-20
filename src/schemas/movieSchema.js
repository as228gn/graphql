import gql from 'graphql-tag'


export const typeDefs = gql`
 type Query {
    movies: [Movie!]!
  }

type Movie {
    id: ID!
    title: String!
    release_year: Int!
    genre: String!
    actors: [Actor]
  }

  type Actor {
    id: ID!
    first_name: String!
    last_name: String!
    movies: [Movie]
  }

  type Rental {
    id: ID!
    rental_date: String!
    return_date: String
  }
  `


