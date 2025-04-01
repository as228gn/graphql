import bcrypt from 'bcrypt'
import { JsonWebToken } from '../lib/JsonWebToken.js'
import db from '../config/db.js'

/**
 * Encapsulates a controller.
 */
export class UserController {

  /**
   * Registrerar en ny användare i MySQL via GraphQL.
   *
   * @param {object} parent - GraphQL parent object (används inte här).
   * @param {object} args - Argument som skickas från GraphQL.
   * @returns {Promise<object>} Returnerar den skapade användaren.
   */
  async registerUser(username, password) {
    try {
      // Hasha lösenordet innan det sparas
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Lägg till användaren i databasen
      const [result] = await db.query(
        'INSERT INTO user (username, password) VALUES (?, ?)',
        [username, hashedPassword]
      )

      const [user] = await db.query('SELECT id_user, username FROM user WHERE id_user = ?', [result.insertId])

      if (user.length === 0) {
        throw new Error("User not found after insertion");
      }

      return user[0]

    } catch (error) {
      if (error.code == 'ER_DUP_ENTRY') {
        throw new Error('Username already exists')
      }
      throw new Error('Error registering user')
    }
  }

  async loginUser (username, password) {
    const [users] = await db.query("SELECT * FROM user WHERE username = ?", [username])
    
      if (users.length === 0) {
        throw new Error("Invalid username or password")
      }
      const user = users[0]

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        throw new Error("Invalid username or password")
      }

      const token = await JsonWebToken.encodeUser(user, "DIN_HEMLIGA_NYCKEL", 3600)

      return { token, user }
      
  }
}
