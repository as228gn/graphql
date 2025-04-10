import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone' // För att köra Apollo Server utan Express
import { typeDefs } from './schemas/typeDefs.js'
import { resolvers } from './resolvers/resolvers.js'
import db from './config/db.js'
import { authenticateJWT } from './middlewares/auth.js'

db.getConnection()
  .then(() => console.log('Database connected successfully!'))
  .catch((err) => {
    console.error('Database connection failed: ', err)
    process.exit(1)
  })

const serverApollo = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true
})

// Starta Apollo Server utan Express (standalone server)
const { url } = await startStandaloneServer(serverApollo, {
  /**
   * Skapar en GraphQL-kontext genom att autentisera en användare via JWT.
   *
   * @param {object} context - Kontextobjektet som innehåller HTTP-requesten.
   * @param {object} context.req - HTTP-requestobjektet.
   * @returns {Promise<{user: object | null}>} Ett objekt som innehåller den autentiserade användaren eller `null` om autentisering misslyckas.
   */
  context: async ({ req }) => {
    const user = await authenticateJWT(req)
    return { user }
  },
  listen: { port: process.env.PORT || 3000 }
})

console.log(`Apollo Server running at ${url}`)
