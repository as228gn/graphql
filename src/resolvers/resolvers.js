// Importera controllerfunktioner som hanterar databasinteraktioner
import { MovieController } from '../controllers/MovieController.js'  // För att hämta alla filmer
const controller = new MovieController()
export const resolvers = {
 
  Query: {
    // Resolver för 'movies' query
    movies: async () => {
      return await controller.getMovies();  // Hämtar alla filmer från databasen
    },

    // Resolver för att hämta en specifik film
    movie: async (_, { id }) => {
      return await controller.getMovieById(id); // Hämtar en film baserat på id
    }
  },
}