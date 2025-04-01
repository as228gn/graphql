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
        return rows[0].rental_count // Returnera antal uthyrningar
      } else {
        return 0 // Om ingen uthyrning hittades, returnera 0
      }
    } catch (error) {
      console.error("Error fetching rental count:", error)
      return 0
    }
  }
  

  // Funktion för att skapa en ny film
  async createMovie(title, description, release_year, rating) {
    try {
      // const language_id = 1
  
      const [result] = await db.query(
        'INSERT INTO film (title, description, release_year, rating) VALUES (?, ?, ?, ?)',
        [title, description, release_year, rating]
      )

      return result.title
  
    } catch (error) {
      // Fångar eventuella SQL-fel och loggar dem
      console.error('Error executing SQL query:', error)
    }
  }

  async deleteMovie(id) {
    try {
      // Kör DELETE-frågan i databasen
      const [result] = await db.query(
        'DELETE FROM film WHERE film_id = ?',
        [id]
      )
  
      // Kontrollera om en rad faktiskt raderades
      if (result.affectedRows > 0) {
        console.log(`Film med ID ${id} raderades.`)
        return true
      } else {
        console.log(`Ingen film hittades med ID ${id}.`)
        return false
      }
    } catch (error) {
      // Fångar eventuella SQL-fel och loggar dem
      console.error('Error executing SQL query:', error)
      return false
    }
  }

  async updateMovie(id, title, description, releaseYear, rating) {
    try {
      // Bygg dynamiskt SQL för att uppdatera endast de fält som skickas in
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
        throw new Error("Inga uppdateringar angavs.")
      }
  
      values.push(id) // ID ska vara sista parametern i VALUES
  
      const query = `UPDATE film SET ${updates.join(", ")} WHERE film_id = ?`
      const [result] = await db.query(query, values)
  
      if (result.affectedRows > 0) {
        console.log(`Film med ID ${id} uppdaterades.`)
        return await this.getMovieById(id); // Hämta och returnera den uppdaterade filmen
      } else {
        throw new Error(`Ingen film hittades med ID ${id}.`)
      }
    } catch (error) {
      console.error("Error updating movie:", error)
      throw new Error("Kunde inte uppdatera filmen.")
    }
  }
  
}