import { MovieController } from '../controllers/MovieController.js'
const controller = new MovieController()
export const movieResolver = {

  Query: {
    movies: async (_, { genreName, rating }) => {
      const filters = {}

      if (genreName) {
        filters.genreName = genreName
      }

      if (rating) {
        filters.rating = rating
      }

      const movies = await controller.getMovies(filters)
      for (let movie of movies) {
        const actors = await controller.getActorsForMovie(movie.film_id)
        movie.actors = actors

        const genre = await controller.getGenreForMovie(movie.film_id)
        movie.genre = genre

        const rentalCount = await controller.getRentalCountForMovie(movie.film_id)
        movie.rentalCount = rentalCount
      }
      return movies
    },

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

    actors: async () => {
      return await controller.getActors()
    },
    
  },

  Mutation: {
    createMovie: async (_, { title, description, release_year, rating }, context) => {
      if (!context.user) {
        throw new Error("Unauthorized")
      }
      return await controller.createMovie(title, description, release_year, rating)
    },

    deleteMovie: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error("Unauthorized")
      }
      return await controller.deleteMovie(id);
    },

    updateMovie: async (_, { id, title, description, releaseYear, rating }, context) => {
      if (!context.user) {
        throw new Error("Unauthorized")
      }
      return await controller.updateMovie(id, title, description, releaseYear, rating)
    }
  }
}