/**
 * @file This module contains the configuration for the Mysql2 Database.
 * @module Mysql2
 * @author Anna Ståhlberg
 */

// import fs from 'fs'
// import mysql from 'mysql2'
// import path from 'path'

// const __filename = new URL(import.meta.url).pathname
// const __dirname = path.dirname(__filename)

// const absoluteCertPath = path.resolve(__dirname, '../../DigiCertGlobalRootCA.crt.pem')

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: 3306,
//   ssl: {
//     ca: fs.readFileSync(absoluteCertPath, 'utf8')
//   }
// })

// export default pool.promise()

import dotenv from 'dotenv'
import mysql from 'mysql2'

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

export default pool.promise()
