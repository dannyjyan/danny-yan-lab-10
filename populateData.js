require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Review = require('./models/Review'); // Make sure this model exists

// Connect to MongoDB (no legacy options needed)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to Online MongoDB cluster'))
    .catch(err => console.error('Connection failed:', err));

// Movies with initial rating = 0
const movies = [
    { name: "The Dark Knight", genre: "action", rating: 0 },
    { name: "Inception", genre: "sci-fi", rating: 0 },
    { name: "The Godfather", genre: "drama", rating: 0 },
    { name: "Superbad", genre: "comedy", rating: 0 },
    { name: "Interstellar", genre: "sci-fi", rating: 0 },
    { name: "Pulp Fiction", genre: "drama", rating: 0 },
    { name: "Avengers: Endgame", genre: "action", rating: 0 },
    { name: "The Hangover", genre: "comedy", rating: 0 },
    { name: "Forrest Gump", genre: "drama", rating: 0 },
    { name: "Guardians of the Galaxy", genre: "sci-fi", rating: 0 }
];

// Reviews mapped by movie name
const reviewsPerMovie = {
    "The Dark Knight": [
        { reviewer: "Alice", comment: "An intense, gritty masterpiece!", rating: 5 },
        { reviewer: "Bob", comment: "Too dark and long for my taste.", rating: 3.2 }
    ],
    "Inception": [
        { reviewer: "Charlie", comment: "Mind-bending and visually stunning.", rating: 4.7 },
        { reviewer: "Dana", comment: "Overcomplicated and a bit confusing.", rating: 3.5 }
    ],
    "The Godfather": [
        { reviewer: "Elena", comment: "Timeless storytelling and acting.", rating: 5 },
        { reviewer: "Frank", comment: "Slow pacing and too long.", rating: 3.8 }
    ],
};


const populateData = async () => {
    try {
        await Review.deleteMany();
        await Movie.deleteMany();
        const insertedMovies = await Movie.insertMany(movies);
        console.log(`🎬 Inserted ${insertedMovies.length} movies`);

        for (const movie of insertedMovies) {
            const reviewData = reviewsPerMovie[movie.name];
            if (reviewData) {
                const linkedReviews = reviewData.map(r => ({
                    ...r,
                    movieId: movie._id
                }));
                await Review.insertMany(linkedReviews);
                console.log(`Reviews added for "${movie.name}"`);
            }
        }

        console.log('All data populated successfully');
    } catch (err) {
        console.error('Error populating data:', err);
    } finally {
        mongoose.connection.close();
    }
};

populateData();
