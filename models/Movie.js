const mongoose = require('mongoose');

// Movie Schema
const movieSchema = new mongoose.Schema({
    name: String,
    genre: String,
    rating: Number,
});

// Movie Model
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;