/**
 * @file Defines the MovieController class.
 * @module MovieController
 * @author Anna Ståhlberg
 */

import db from '../config/db.js'
/**
 * Encapsulates a controller.
 */
export class MovieController {
  /**
   * The startpage.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async getMovies() {
    try {
      const [movies] = await db.query('SELECT * FROM film')  // Byt ut 'movie' med rätt tabellnamn om det behövs
      return movies  // Returnera resultaten som en lista med filmer
    } catch (error) {
      throw new Error('Could not fetch movies: ' + error.message);
    }
  }

  async getMovieById(id) {
    try {
      const [result] = await db.query('SELECT * FROM film WHERE film_id = ?', [id])
      const movie = result[0]
      return movie
    } catch (error) {
      throw new Error('Could not fetch movie: ' + error.message);
    }
  }
  
}