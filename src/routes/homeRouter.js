/**
 * @file HomeRouter.
 * @module routes/router
 * @author Anna Ståhlberg
 * @version 3.0.0
 */

import express from 'express'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to the GraphQl API!' }))