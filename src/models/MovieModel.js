/**
 * @file Defines the image model.
 * @module MovieModel
 * @author Anna Ståhlberg
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'
import { release } from 'os'

// Create a schema.
const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  title: {
    type: String,
    required: true
  },
  release_year: {
    type: String
  },
  genre: {
    type: String
  },
  description: {
    type: String
  }
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const MovieModel = mongoose.model('Movie', schema)