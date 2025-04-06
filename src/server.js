import { ApolloServer } from '@apollo/server' // Importera Apollo Server
import { startStandaloneServer } from '@apollo/server/standalone' // För att köra Apollo Server utan Express
import { typeDefs } from './schemas/typeDefs.js' // Importera schema (GraphQL)
import { resolvers } from './resolvers/resolvers.js' // Importera resolvers
import db from './config/db.js' // Databasanslutning
import { authenticateJWT } from './middlewares/auth.js'

// Hantera databasanslutningen
db.getConnection()
  .then(() => console.log('Database connected successfully!'))
  .catch((err) => {
    console.error('Database connection failed: ', err)
    process.exit(1)
  })

// Skapa Apollo Server
const serverApollo = new ApolloServer({
  typeDefs, // Ditt schema
  resolvers, // Ditt resolvers-objekt
  introspection: true, // Tillåt introspektion i produktion (nödvändigt för Playground)
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
  }, // Om du behöver något i kontexten, t.ex. autentisering
  listen: { port: process.env.PORT || 3000 } // Välj port (standard är 3000)
})

console.log(`Apollo Server running at ${url}`) // Logga GraphQL-URL:en
