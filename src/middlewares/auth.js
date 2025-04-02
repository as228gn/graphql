/**
 * @file Authentication and authorization middlewares.
 * @module middlewares/auth
 * @author Anna Ståhlberg
 * @version 1.0.0
 */

import http from 'node:http'
import { JsonWebToken } from '../lib/JsonWebToken.js'
import fs from 'fs'

/**
 * Authenticates a request based on a JSON Web Token (JWT).
 *
 * This middleware checks the authorization header of the request, verifies the authentication scheme,
 * decodes the JWT using the provided secret key, and attaches the decoded user object to the `req.user` property.
 * If the authentication fails, an unauthorized response with a 401 Unauthorized status code is sent.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
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
    console.error("Authentication failed: ", error.message)
    return null
  }
}
