// Importera controllerfunktioner som hanterar databasinteraktioner
import { MovieController } from '../controllers/MovieController.js'  // För att hämta alla filmer
const controller = new MovieController()
export const movieResolver = {

  Query: {
    // Resolver för 'movies' query
    movies: async (_, { genreName, rating }) => {
      const filters = {}

      if (genreName) {
        filters.genreName = genreName  // Lägg till filter för genreName om det finns
      }

      if (rating) {
        filters.rating = rating // Lägg till filter för release year om det finns
      }

      const movies = await controller.getMovies(filters) // Hämtar alla filmer från databasen
      // För varje film, hämta aktörerna och lägg till dem i filmen
      for (let movie of movies) {
        const actors = await controller.getActorsForMovie(movie.film_id)  // Hämtar aktörer för filmen
        movie.actors = actors

        // Hämta genre för filmen
        const genre = await controller.getGenreForMovie(movie.film_id)
        movie.genre = genre  // Lägger till genre till filmen

        const rentalCount = await controller.getRentalCountForMovie(movie.film_id)
        movie.rentalCount = rentalCount
      }
      return movies
    },

    // Resolver för att hämta en specifik film
    movie: async (_, { id }) => {
      const movie = await controller.getMovieById(id) // Hämtar en film baserat på id
      const actors = await controller.getActorsForMovie(id) // Hämtar aktörer för filmen
      const genres = await controller.getGenreForMovie(id)
      const rentalCount = await controller.getRentalCountForMovie(id)

      movie.actors = actors
      movie.genre = genres
      movie.rentalCount = rentalCount
      return movie
    },

    actors: async () => {
      return await controller.getActors()  // Hämtar alla filmer från databasen
    },
    
  },

  Mutation: {
    // Mutation för att skapa en ny film
    createMovie: async (_, { title, description, release_year, rating }) => {
      // Skapa filmen i databasen
      return await controller.createMovie(title, description, release_year, rating)
    },

    deleteMovie: async (_, { id }) => {
      return await controller.deleteMovie(id);
    },

    updateMovie: async (_, { id, title, description, releaseYear, rating }) => {
      return await controller.updateMovie(id, title, description, releaseYear, rating)
    }
  }
}