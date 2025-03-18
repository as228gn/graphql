/**
 * @file Defines the image model.
 * @module RatingModel
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
  text: {
    type: String,
    required: true
  },
  movie: {
    type: String,
    required: true
  }
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const RatingModel = mongoose.model('Rating', schema)