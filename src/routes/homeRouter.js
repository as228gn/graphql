/**
 * @file HomeRouter.
 * @module routes/router
 * @author Anna Ståhlberg
 * @version 3.0.0
 */

import express from 'express'
import { HomeController } from '../controllers/HomeController.js'

export const router = express.Router()

const controller = new HomeController()

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to the GraphQl API!' }))