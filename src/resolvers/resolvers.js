import { userResolver } from './userResolver.js'  // Om du har en user resolver
import { movieResolver } from './movieResolver.js'  // Importera movie resolvers

export const resolvers = {
  Query: {
    ...movieResolver.Query,  // Lägg till film-relaterade queries
    ...userResolver.Query,   // Lägg till användar-relaterade queries (om du har en userResolver)
  },
  Mutation: {
    ...movieResolver.Mutation,  // Lägg till film-relaterade mutationer
    ...userResolver.Mutation,   // Lägg till användar-relaterade mutationer (om du har en userResolver)
  },
}
