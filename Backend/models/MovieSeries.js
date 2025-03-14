const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  externalId: {
    type: String,
    required: true,
    unique: true, // Unique ID from the external API
  },
  title: {
    type: String,
    required: true,
  },
  originalTitle:{
    type: String,
    required: true,
  },
  categories: {
    type: [String],
    required: true,
    // Example: ['Action', 'Drama', 'Mystery', 'Sci-Fi']
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  synopsis: {
    type: String,
    required: true,
  },
  cast: {
    type: [String], // Array of actor names
    default: [],
  },
  imageUrl: {
    type: String, // URL to the movie poster
  },
  otherImages: {
    type: [String], // Array of URLs to other images
    default: [],
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  criticAverageRating: {
    type: Number,
    default: 0,
  },
  numberOfRatings: {
    type: Number,
    default: 0
  },
  numberOfCriticRatings: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['movie', 'series'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;