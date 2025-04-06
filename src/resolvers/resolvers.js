import { userResolver } from './userResolver.js'
import { movieResolver } from './movieResolver.js'

/**
 * GraphQL resolvers that handle queries and mutations for users and movies.
 *
 * @constant {object} resolvers - The resolver object for GraphQL.
 * @property {object} Query - Contains query resolvers from both `userResolver` and `movieResolver`.
 * @property {object} Mutation - Contains mutation resolvers from both `userResolver` and `movieResolver`.
 */
export const resolvers = {
  Query: {
    ...movieResolver.Query,
    ...userResolver.Query
  },
  Mutation: {
    ...movieResolver.Mutation,
    ...userResolver.Mutation
  }
}
