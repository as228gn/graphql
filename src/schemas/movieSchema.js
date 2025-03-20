import gql from 'graphql-tag'


export const typeDefs = gql`
 type Query {
    movies: [Movie!]!
    movie(id: ID!): Movie
  }

type Movie {
    film_id: ID
    title: String
    description: String
    release_year: Int!
    genre: Genre
    actors: [Actor]
  }

  type Actor {
    id: ID!
    first_name: String!
    last_name: String!
    movies: [Movie]
  }

  type Genre {
    id: ID!
    name: String!
  }

  type Rental {
    id: ID!
    rental_date: String!
    return_date: String
  }
  `


