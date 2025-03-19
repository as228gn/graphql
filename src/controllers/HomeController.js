/**
 * @file Defines the HomeController class.
 * @module HomeController
 * @author Anna Ståhlberg
 */

/**
 * Encapsulates a controller.
 */
export class HomeController {
  /**
   * The startpage.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async index(req, res) {
   console.log("Home")
  }
  
}