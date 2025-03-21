import gql from 'graphql-tag'


export const typeDefs = gql`
 type Query {
    movies(genreName: String, rating: String): [Movie!]!
    movie(id: ID!): Movie
    actors: [Actor!]!
  }

  type Mutation {
  createMovie(title: String!, description: String, releaseYear: Int!, rating: String!): Movie!

  updateMovie(id: ID!, title: String, description: String, releaseYear: Int, rating: String): Movie!

  deleteMovie(id: ID!): Boolean!
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


