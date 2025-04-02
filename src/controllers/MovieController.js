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
   * A query that gives you all the movies with an option to filter them by genre or rating.
   *
   * @param genreName - The genre that you would like to filter your answer on.
   * @param rating - The rating you would like to filter your answer on.
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
      throw new Error('Could not fetch movies: ' + error.message);
    }
  }

  /**
   * A query that gives you a specific film based on an id.
   *
   * @param id - The id of the film to retrieve.
   */
  async getMovieById(id) {
    try {
      const [result] = await db.query('SELECT * FROM film WHERE film_id = ?', [id])
      const movie = result[0]
      return movie
    } catch (error) {
      throw new Error('Could not fetch movie: ' + error.message);
    }
  }

  /**
   * A query that gives you the genre for a specific movie.
   *
   * @param id - The id of the movie to retrieve the genre from.
   */
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

   /**
    * A query that gives you all the actors.
    *
    */
  async getActors() {
    try {
      const [actors] = await db.query('SELECT * FROM actor')
      return actors
    } catch (error) {
      throw new Error('Could not fetch actors: ' + error.message);
    }
  }

   /**
    * A query that gives you all the actors from a specific movie
    *
    * @param id - The id of the film to retrieve the actors from.
    */
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

   /**
   * A query that gives you the rental count for a specific movie..
   *
   * @param id - The id of the film to retrieve the rental count from
   */
  async getRentalCountForMovie(id) {
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
      console.error("Error fetching rental count:", error)
      return 0
    }
  }


   /**
   * A query that creates a new movie, it needs a jwt to function.
   *
   * @param title - The title of the film to create.
   * @param description - The description of the film to create.
   * @param release_year - The release year of the film to create
   * @param rating - The rating of the film to create
   */
  async createMovie(title, description, release_year, rating) {
    try {
      const language_id = 1

      const [result] = await db.query(
        'INSERT INTO film (title, description, release_year, language_id, rating) VALUES (?, ?, ?, ?, ?)',
        [title, description, release_year, language_id, rating]
      )

      return await this.getMovieById(result.insertId)


    } catch (error) {
      console.error('Error executing SQL query:', error)
    }
  }

   /**
   * A query that deletes a movie, it needs a jwt to function.
   *
   * @param id - The id of the film to delete.
   */
  async deleteMovie(id) {
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
   * @param id - The id of the movie to update.
   * @param title - The title of the movie to update.
   * @param description - The description of the movie to update.
   * @param releaseYear - The release year of the movie to update.
   * @param rating - The rating of the movie to update.
   */
  async updateMovie(id, title, description, releaseYear, rating) {
    try {
      const updates = []
      const values = []

      if (title) {
        updates.push("title = ?")
        values.push(title);
      }
      if (description) {
        updates.push("description = ?")
        values.push(description);
      }
      if (releaseYear) {
        updates.push("release_year = ?")
        values.push(releaseYear)
      }
      if (rating) {
        updates.push("rating = ?")
        values.push(rating)
      }

      if (updates.length == 0) {
        throw new Error("No updates where given.")
      }

      values.push(id) // ID should be the last parameter

      const query = `UPDATE film SET ${updates.join(", ")} WHERE film_id = ?`
      const [result] = await db.query(query, values)

      if (result.affectedRows > 0) {
        return await this.getMovieById(id)
      } else {
        throw new Error(`No movie with ID: ${id} found.`)
      }
    } catch (error) {
      throw new Error("Could not find the movie.")
    }
  }

}