import { UserController } from '../controllers/UserController.js'
const controller = new UserController()

/**
 * GraphQL resolvers for user-related mutations.
 *
 * @constant {object} userResolver - The resolver object for user mutations.
 * @property {object} Mutation - Contains mutation resolvers for user authentication.
 * @property {Function} Mutation.registerUser - Registers a new user.
 * @property {Function} Mutation.loginUser - Logs in a user and returns authentication details.
 */
export const userResolver = {
  Mutation: {
    /**
     * Registers a new user.
     *
     * @async
     * @param {object} _ - Placeholder for the root resolver (not used).
     * @param {object} args - The arguments for the mutation.
     * @param {string} args.username - The username of the new user.
     * @param {string} args.password - The password of the new user.
     * @returns {Promise<object>} The registered user object.
     */
    registerUser: async (_, { username, password }) => {
      return await controller.registerUser(username, password)
    },
    /**
     * Logs in a user and returns an authentication token.
     *
     * @async
     * @param {object} _ - Placeholder for the root resolver (not used).
     * @param {object} args - The arguments for the mutation.
     * @param {string} args.username - The username of the user.
     * @param {string} args.password - The password of the user.
     * @returns {Promise<string>} A JWT token for authentication.
     */
    loginUser: async (_, { username, password }) => {
      return await controller.loginUser(username, password)
    }
  }
}
