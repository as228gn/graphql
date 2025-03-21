// Importera controllerfunktioner som hanterar databasinteraktioner
import { MovieController } from '../controllers/MovieController.js'  // För att hämta alla filmer
const controller = new MovieController()
export const resolvers = {
 
  Query: {
    // Resolver för 'movies' query
    movies: async (_, { rating }) => {
      let param
      
      if (rating) {
        param = rating  // Lägg till filter för release year om det finns
      }

      const movies = await controller.getMovies(param) // Hämtar alla filmer från databasen
      // För varje film, hämta aktörerna och lägg till dem i filmen
      for (let movie of movies) {
        const actors = await controller.getActorsForMovie(movie.film_id)  // Hämtar aktörer för filmen
        movie.actors = actors

        // Hämta genre för filmen
        const genre = await controller.getGenreForMovie(movie.film_id)
        movie.genre = genre  // Lägger till genre till filmen
      }
      return movies
    },

    // Resolver för att hämta en specifik film
    movie: async (_, { id }) => {
      const movie = await controller.getMovieById(id) // Hämtar en film baserat på id
      const actors = await controller.getActorsForMovie(id); // Hämtar aktörer för filmen
      movie.actors = actors
      return movie
    },

    actors: async () => {
      return await controller.getActors()  // Hämtar alla filmer från databasen
    },
  },
}