require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Movie = require('./models/Movie'); // Import the Movie model
const Review = require('./models/Review');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies
app.use(express.static('public', { index: 'manager.html' }));
app.use('/images', express.static('images'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(
    () => console.log('Connected to MongoDB - Movie Database')).catch(err => console.error('Failed to connect to MongoDB:', err));

// Routes

// Create a new movie (C)
app.post('/movies', async (req, res) => {
    try {
        const { name, genre, rating } = req.body;
        const newMovie = new Movie({ name, genre, rating });
        await newMovie.save();
        res.status(201).json(newMovie); // 201 Created
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get/Read all movies (R)
app.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find(); // Fetch all movies from MongoDB
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

// Example: PUT /movies/:id
// Description: This endpoint should update a movie's details by its ID.
// Note: This endpoint should handle the case where the movie does not exist and return an appropriate error message.

app.put('/movies/:id', async (req, res) => {
    try {
        const { name, genre, rating } = req.body;
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, { name, genre, rating }, { new: true });
        if (!updatedMovie) return res.status(404).json({ error: 'Movie not found' });
        res.json(updatedMovie);
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID format' });
    }
});

// Example: DELETE /movies/:id
// Description: This endpoint should delete a movie by its ID.
// Note: This endpoint should handle the case where the movie does not exist and return an appropriate error message.

app.delete('/movies/:id', async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) return res.status(404).json({ error: 'Movie not found' });
        res.json({ message: 'Movie deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID format' });
    }
});

// Get movie by ID
app.get('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID format' });
    }
});


// Description: This endpoint should return all reviews for a specific movie by its ID.
app.get('/movies/:id/reviews', async (req, res) => {
    try {
        const reviews = await Review.find({ movieId: req.params.id });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});




// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
