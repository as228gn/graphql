import gql from 'graphql-tag'


export const typeDefs = gql`
 type Query {
    movies(rating: String): [Movie!]!
    movie(id: ID!): Movie
    actors: [Actor!]!
  }

type Movie {
    film_id: ID
    title: String
    description: String
    release_year: Int!
    rating: String
    genre: Genre
    actors: [Actor]
  }

  type Actor {
    actor_id: ID!
    first_name: String!
    last_name: String
    movies: [Movie]
  }

  type Genre {
    category_id: ID!
    name: String
  }

  type Rental {
    id: ID!
    rental_date: String!
    return_date: String
  }
  `


