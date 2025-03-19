/**
 * @file Defines the image model.
 * @module ActorModel
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
  name: {
    type: String,
    required: true
  },
  movies_played: {
    type: String,
    required: true
  }
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const ActorModel = mongoose.model('Actor', schema)