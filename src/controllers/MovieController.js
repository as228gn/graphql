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
   * Retrieves movies from the database based on optional filters (genre and rating). This function constructs a dynamic SQL query to fetch movies from the database, with optional filters for genre and rating. If either of the filters is provided, the query is modified to include those conditions.
   *
   * @param {object} params - The parameters object containing optional filter values.
   * @param {string} [params.genreName] - The name of the genre to filter movies by.
   * @param {number} [params.rating] - The rating to filter movies by.
   * @returns {Promise<Array>} A promise that resolves to an array of movies that match the filters.
   * @throws {Error} If there is an issue with the SQL query or database connection.
   */
  async getMovies ({ genreName, rating }) {
    try {
      let query = `
    SELECT f.film_id, f.title, f.description, f.release_year, f.rating 
    FROM film f
    JOIN film_category fc ON f.film_id = fc.film_id
    JOIN category c ON fc.category_id = c.category_id
  `
      const params = []
      // Add filter for genre if genre exists
      if (genreName) {
        query += ' WHERE c.name = ?'
        params.push(genreName)
      }

      // Add filter for rating if rating exists
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
      throw new Error('Could not fetch movies: ' + error.message)
    }
  }

  /**
   * A query that gives you a specific film based on an id.
   *
   * @param {number} id - The id of the film to retrieve.
   * @returns {object} - The movie.
   */
  async getMovieById (id) {
    try {
      const [result] = await db.query('SELECT * FROM film WHERE film_id = ?', [id])
      const movie = result[0]
      return movie
    } catch (error) {
      throw new Error('Could not fetch movie: ' + error.message)
    }
  }

  /**
   * A query that gives you the genre for a specific movie.
   *
   * @param {number} id - The id of the movie to retrieve the genre from.
   * @returns {string} - The genre of the movie.
   */
  async getGenreForMovie (id) {
    try {
      const [result] = await db.query(`
        SELECT c.category_id, c.name
        FROM category c
        JOIN film_category fc ON fc.category_id = c.category_id
        WHERE fc.film_id = ?`, [id])
      const genre = result[0]
      return genre
    } catch (error) {
      throw new Error('Could not fetch genre: ' + error.message)
    }
  }

  /**
   * A query that gives you all the actors.
   *
   * @returns {object} - The actors
   */
  async getActors () {
    try {
      const [actors] = await db.query('SELECT * FROM actor')
      return actors
    } catch (error) {
      throw new Error('Could not fetch actors: ' + error.message)
    }
  }

  /**
   * Retrieves a list of actors associated with a specific movie. This function queries the database to fetch the actors who are associated with a given movie (identified by its `id`). It returns an array of actors that appear in the movie,including their `actor_id`, `first_name`, and `last_name`.
   *
   * @param {number} id - The ID of the movie for which to fetch the actors.
   * @returns {Promise<Array>} A promise that resolves to an array of actor objects, each containing `actor_id`, `first_name`, and `last_name`.
   * @throws {Error} If there is an issue with the SQL query or database connection.
   */
  async getActorsForMovie (id) {
    try {
      const [actors] = await db.query(`
        SELECT a.actor_id, a.first_name, a.last_name
        FROM actor a
        JOIN film_actor fa ON fa.actor_id = a.actor_id
        WHERE fa.film_id = ?`, [id])
      return actors
    } catch (error) {
      throw new Error('Could not fetch actors: ' + error.message)
    }
  }

  /**
   * A query that gives you the rental count for a specific movie..
   *
   * @param {number} id - The id of the film to retrieve the rental count from.
   * @returns {number} - The rental count.
   */
  async getRentalCountForMovie (id) {
    try {
      const query = `
        SELECT f.film_id, f.title, COUNT(r.rental_id) AS rental_count
        FROM film f
        JOIN inventory i ON f.film_id = i.film_id
        JOIN rental r ON i.inventory_id = r.inventory_id
        WHERE f.film_id = ?
        GROUP BY f.film_id, f.title;
      `

      const [rows] = await db.query(query, [id])

      if (rows.length > 0) {
        return rows[0].rental_count
      } else {
        return 0
      }
    } catch (error) {
      throw new Error('Error fetching rental count: ' + error.message)
    }
  }

  /**
   * A query that creates a new movie, it needs a jwt to function.
   *
   * @param {string} title - The title of the film to create.
   * @param {string} description - The description of the film to create.
   * @param {number} releaseYear - The release year of the film to create.
   * @param {string} rating - The rating of the film to create.
   * @returns {object} - The movie created.
   */
  async createMovie (title, description, releaseYear, rating) {
    try {
      const languageId = 1

      const [result] = await db.query(
        'INSERT INTO film (title, description, release_year, language_id, rating) VALUES (?, ?, ?, ?, ?)',
        [title, description, releaseYear, languageId, rating]
      )

      return await this.getMovieById(result.insertId)
    } catch (error) {
      throw new Error('Could not create movie: ' + error.message)
    }
  }

  /**
   * A query that deletes a movie, it needs a jwt to function.
   *
   * @param {number} id - The id of the film to delete.
   * @returns {boolean} - Returns true or false depending on if the deleting where succesfull or not.
   */
  async deleteMovie (id) {
    try {
      const [result] = await db.query(
        'DELETE FROM film WHERE film_id = ?',
        [id]
      )

      if (result.affectedRows > 0) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  /**
   * A query that updates a movie, it needs a jwt to function.
   *
   * @param {number} id - The id of the movie to update.
   * @param {string} title - The title of the movie to update.
   * @param {string} description - The description of the movie to update.
   * @param {number} releaseYear - The release year of the movie to update.
   * @param {string} rating - The rating of the movie to update.
   * @returns {object} - The movie updated.
   */
  async updateMovie (id, title, description, releaseYear, rating) {
    try {
      const updates = []
      const values = []

      if (title) {
        updates.push('title = ?')
        values.push(title)
      }
      if (description) {
        updates.push('description = ?')
        values.push(description)
      }
      if (releaseYear) {
        updates.push('release_year = ?')
        values.push(releaseYear)
      }
      if (rating) {
        updates.push('rating = ?')
        values.push(rating)
      }

      if (updates.length === 0) {
        throw new Error('No updates where given.')
      }

      values.push(id) // ID should be the last parameter

      const query = `UPDATE film SET ${updates.join(', ')} WHERE film_id = ?`
      const [result] = await db.query(query, values)

      if (result.affectedRows > 0) {
        return await this.getMovieById(id)
      } else {
        throw new Error(`No movie with ID: ${id} found.`)
      }
    } catch (error) {
      throw new Error('Could not find the movie: ' + error.message)
    }
  }
}
