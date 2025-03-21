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
  async getMovies({ genreName, rating }) {
    try {
      let query = `
    SELECT f.film_id, f.title, f.description, f.release_year, f.rating 
    FROM film f
    JOIN film_category fc ON f.film_id = fc.film_id
    JOIN category c ON fc.category_id = c.category_id
  `
  let params = []
   // Lägg till filter för genre om genreName finns
   if (genreName) {
    query += ' WHERE c.name = ?'
    params.push(genreName)
  }

  // Lägg till filter för rating om det finns
  if (rating) {
    if (params.length > 0) {
      query += ' AND f.rating = ?'
    } else {
      query += ' WHERE f.rating = ?'
    }
    params.push(rating)
  }
  
  const [movies] = await db.query(query, params)
  return movies
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

  async getGenreForMovie(id) {
    try {
      const [result] = await db.query(`
        SELECT c.category_id, c.name
        FROM category c
        JOIN film_category fc ON fc.category_id = c.category_id
        WHERE fc.film_id = ?`, [id])
        const genre = result[0]
      return genre
    } catch (error) {
      throw new Error('Could not fetch genre: ' + error.message);
    }
  }

  async getActors() {
    try {
      const [actors] = await db.query('SELECT * FROM actor')
      return actors
    } catch (error) {
      throw new Error('Could not fetch actors: ' + error.message);
    }
  }

  async getActorsForMovie(id) {
    try {
      const [actors] = await db.query(`
        SELECT a.actor_id, a.first_name, a.last_name
        FROM actor a
        JOIN film_actor fa ON fa.actor_id = a.actor_id
        WHERE fa.film_id = ?`, [id])
      return actors
    } catch (error) {
      throw new Error('Could not fetch actors: ' + error.message);
    }
  }
  
}