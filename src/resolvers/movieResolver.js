import { MovieController } from '../controllers/MovieController.js'
const controller = new MovieController()

/**
 * GraphQL resolvers for movie-related queries and mutations.
 *
 * @constant {object} movieResolver - The resolver object for movie queries and mutations.
 * @property {object} Query - Contains query resolvers for fetching movie data.
 * @property {Function} Query.movies - Resolves the query to fetch movies based on optional filters (genreName, rating).
 * @property {Function} Query.movie - Resolves the query to fetch a single movie by its ID.
 * @property {Function} Query.actors - Resolves the query to fetch all actors.
 * @property {object} Mutation - Contains mutation resolvers for creating, deleting, and updating movies.
 * @property {Function} Mutation.createMovie - Creates a new movie.
 * @property {Function} Mutation.deleteMovie - Deletes a movie by ID.
 * @property {Function} Mutation.updateMovie - Updates a movie by ID.
 */
export const movieResolver = {
  Query: {
    /**
     * Fetches a list of movies filtered by genre or rating.
     *
     * @async
     * @param {object} _ - Placeholder for the root resolver (not used).
     * @param {object} args - The arguments for the query.
     * @param {string} [args.genreName] - Optional genre filter.
     * @param {number} [args.rating] - Optional rating filter.
     * @param {number} [args.limit=100] - The number of movies to return. Defaults to 100.
     * @param {number} [args.offset=0] - The number of movies to skip from the beginning of the result set.
     * @returns {Promise<Array>} List of movies that match the filters.
     */
    movies: async (_, { genreName, rating, limit = 100, offset = 0 }) => {
      const filters = {}

      if (genreName) {
        filters.genreName = genreName
      }

      if (rating) {
        filters.rating = rating
      }

      const movies = await controller.getMovies(filters, limit + 1, offset)

      const hasMore = movies.length > limit
      if (hasMore) movies.pop()

      for (const movie of movies) {
        const [actors, genre, rentalCount] = await Promise.all([
          controller.getActorsForMovie(movie.film_id),
          controller.getGenreForMovie(movie.film_id),
          controller.getRentalCountForMovie(movie.film_id)
        ])
        movie.actors = actors
        movie.genre = genre
        movie.rentalCount = rentalCount
      }

      return { movies, hasMore }
    },

    /**
     * Fetches a single movie by its ID along with its actors, genre, and rental count.
     *
     * @async
     * @param {object} _ - Placeholder for the root resolver (not used).
     * @param {object} args - The arguments for the query.
     * @param {string} args.id - The ID of the movie to fetch.
     * @returns {Promise<object>} The movie object with additional details (actors, genre, rental count).
     */
    movie: async (_, { id }) => {
      const movie = await controller.getMovieById(id)
      const actors = await controller.getActorsForMovie(id)
      const genres = await controller.getGenreForMovie(id)
      const rentalCount = await controller.getRentalCountForMovie(id)

      movie.actors = actors
      movie.genre = genres
      movie.rentalCount = rentalCount
      return movie
    },

    /**
     * Fetches all actors.
     *
     * @async
     * @returns {Promise<Array>} A list of all actors.
     */
    actors: async () => {
      return await controller.getActors()
    }

  },

  Mutation: {
    /**
     * Creates a new movie.
     *
     * @async
     * @param {object} _ - Placeholder for the root resolver (not used).
     * @param {object} args - The arguments for the mutation.
     * @param {string} args.title - The title of the new movie.
     * @param {string} args.description - A description of the new movie.
     * @param {number} args.releaseYear - The release year of the new movie.
     * @param {number} args.rating - The rating of the new movie.
     * @param {object} context - The context object, which contains the user data.
     * @param {object} context.user - The authenticated user making the request.
     * @throws {Error} If the user is not authenticated, throws an "Unauthorized" error.
     * @returns {Promise<object>} The created movie object.
     */
    createMovie: async (_, { title, description, releaseYear, rating }, context) => {
      if (!context.user) {
        throw new Error('Unauthorized')
      }
      return await controller.createMovie(title, description, releaseYear, rating)
    },

    /**
     * Deletes a movie by its ID.
     *
     * @async
     * @param {object} _ - Placeholder for the root resolver (not used).
     * @param {object} args - The arguments for the mutation.
     * @param {string} args.id - The ID of the movie to delete.
     * @param {object} context - The context object, which contains the user data.
     * @param {object} context.user - The authenticated user making the request.
     * @throws {Error} If the user is not authenticated, throws an "Unauthorized" error.
     * @returns {Promise<boolean>} `true` if the movie was successfully deleted, otherwise `false`.
     */
    deleteMovie: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error('Unauthorized')
      }
      const result = await controller.deleteMovie(id)

      if (result.success) {
        return {
          success: true,
          message: result.message,
          deletedFilmId: result.deletedFilmId
        }
      } else {
        return {
          success: false,
          message: result.message || 'Failed to delete the movie.',
          deletedFilmId: null
        }
      }
    },

    /**
     * Updates an existing movie.
     *
     * @async
     * @param {object} _ - Placeholder for the root resolver (not used).
     * @param {object} args - The arguments for the mutation.
     * @param {string} args.id - The ID of the movie to update.
     * @param {string} [args.title] - The updated title of the movie (optional).
     * @param {string} [args.description] - The updated description of the movie (optional).
     * @param {number} [args.releaseYear] - The updated release year of the movie (optional).
     * @param {number} [args.rating] - The updated rating of the movie (optional).
     * @param {object} context - The context object, which contains the user data.
     * @param {object} context.user - The authenticated user making the request.
     * @throws {Error} If the user is not authenticated, throws an "Unauthorized" error.
     * @returns {Promise<object>} The updated movie object.
     */
    updateMovie: async (_, { id, title, description, releaseYear, rating }, context) => {
      if (!context.user) {
        throw new Error('Unauthorized')
      }
      return await controller.updateMovie(id, title, description, releaseYear, rating)
    }
  }
}
