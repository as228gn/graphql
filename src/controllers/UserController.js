import bcrypt from 'bcrypt'
import { JsonWebToken } from '../lib/JsonWebToken.js'
import db from '../config/db.js'
import fs from 'fs'

/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   * Registers a new user, hashes the password and stores it in the database.
   *
   * @param {string} username - The username of the new user.
   * @param {string} password - The password of the new user.
   * @returns {Promise<object>} Returnerar den skapade användaren.
   */
  async registerUser (username, password) {
    try {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const [result] = await db.query(
        'INSERT INTO user (username, password) VALUES (?, ?)',
        [username, hashedPassword]
      )

      const [user] = await db.query('SELECT id_user, username FROM user WHERE id_user = ?', [result.insertId])

      if (user.length === 0) {
        throw new Error('User not found after insertion')
      }

      return user[0]
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Non valid username')
      }
      throw new Error('Error registering user')
    }
  }

  /**
   * Logs in a user and gives a jwt for authentication.
   *
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @returns {string} - The jwt to use for authorization.
   */
  async loginUser (username, password) {
    const jwtPrivateKey = fs.readFileSync('./private.pem', 'utf8')
    const [users] = await db.query('SELECT * FROM user WHERE username = ?', [username])

    if (users.length === 0) {
      throw new Error('Invalid username or password')
    }
    const user = users[0]

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error('Invalid username or password')
    }

    const token = await JsonWebToken.encodeUser(user, jwtPrivateKey, 3600)

    return token
  }
}
