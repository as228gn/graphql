/**
 * @file The starting point of the application.
 * @module src/server
 * @author Anna Ståhlberg
 * @version 1.0.0
 */

import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import logger from 'morgan'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import db from './config/db.js'
import { router } from './routes/router.js'

// Get the path of the current module's directory.
const directoryFullName = dirname(fileURLToPath(import.meta.url))

// Set the base URL to use for all relative URLs in a document.
const baseURL = process.env.BASE_URL || '/'

// Create Express application.
const app = express()

// Set up a morgan logger using the dev format for log entries.
app.use(logger('dev'))

// Parse requests of the content type application/x-www-form-urlencoded.
// Populates the request object with a body object (req.body).
app.use(express.urlencoded({ extended: false }))

// Serve static files.
app.use(express.static(join(directoryFullName, '..', 'public')))

// Setup and use session middleware (https://github.com/expressjs/session)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1) // trust first proxy
}

// Register routes.
app.use('/', router)

// Error handler.
app.use((err, req, res, next) => {
  console.error(err)

  // 403 Forbidden.
  if (err.status === 403) {
    res
      .status(403)
      .sendFile(join(directoryFullName, 'views', 'errors', '403.html'))
    return
  }

  // 404 Not Found.
  if (err.status === 404) {
    res
      .status(404)
      .sendFile(join(directoryFullName, 'views', 'errors', '404.html'))
    return
  }

  res
    .status(500)
    .sendFile(join(directoryFullName, 'views', 'errors', '500.html'))

  // res
  //   .status(err.status || 500)
  //   .send(err.message || 'Internal Server Error')
})

// Hantera databasanslutningen
db.getConnection()
  .then(() => console.log('Database connected successfully!'))
  .catch((err) => {
    console.error('Database connection failed: ', err)
    process.exit(1)
  })

// Starts the HTTP server listening for connections.
const server = app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${server.address().port}`)
  console.log('Press Ctrl-C to terminate...')
})
