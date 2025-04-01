// Importera controllerfunktioner som hanterar databasinteraktioner
import { UserController } from '../controllers/UserController.js'  // För att hämta alla filmer
const controller = new UserController()
export const userResolver = {
 
  Mutation: {
    // Resolver för att registrera en ny användare
    registerUser: async (_, { username, password }) => {
        return await controller.registerUser(username, password )
    },

    loginUser: async (_, { username, password }) => {
      return await controller.loginUser(username, password )
    }
}
}