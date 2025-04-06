/**
 * @file Authentication and authorization middlewares.
 * @module middlewares/auth
 * @author Anna Ståhlberg
 * @version 1.0.0
 */

import { JsonWebToken } from '../lib/JsonWebToken.js'
import fs from 'fs'

/**
 * Authenticates a request by verifying the JWT token in the Authorization header. This function checks the `Authorization` header for a Bearer token, verifies the JWT token using a public key, and returns the decoded user if the authentication is successful. If the token is missing or invalid, it returns `null`.
 *
 * @async
 * @param {object} req - The HTTP request object.
 * @param {object} req.headers - The headers of the HTTP request.
 * @param {string} req.headers.authorization - The Authorization header containing the Bearer token.
 * @returns {Promise<object|null>} A promise that resolves to the decoded user object if the token is valid, or `null` if the token is missing or invalid.
 * @throws {Error} If the Authorization header scheme is not 'Bearer', an error is thrown.
 */
export const authenticateJWT = async (req) => {
  if (!req.headers.authorization) return null

  const jwtPublicKey = fs.readFileSync('./public.pem', 'utf8')
  try {
    const [authenticationScheme, token] = req.headers.authorization?.split(' ')

    if (authenticationScheme !== 'Bearer') {
      throw new Error('Invalid authentication scheme.')
    }

    return await JsonWebToken.decodeUser(token, jwtPublicKey)
  } catch (error) {
    // Authentication failed.
    console.error('Authentication failed: ', error.message)
    return null
  }
}
