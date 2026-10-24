const BASE_URL = window.location.origin;

async function loadMovies() {
    try {
        const res = await fetch(`${BASE_URL}/movies`);
        const movies = await res.json();

        const tbody = document.querySelector('#movieTable tbody');
        tbody.innerHTML = '';
        movies.forEach(movie => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${movie.name}</td>
                <td>${movie.genre}</td>
                <td>${movie.rating}</td>
                <td><a href="details.html?id=${movie._id}">Details</a></td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading movies:', error);
        alert('Failed to load movie list.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadMovies();

    document.getElementById('addMovieForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const newMovie = {
            name: document.getElementById('newName').value,
            genre: document.getElementById('newGenre').value,
            rating: 0 // Default rating, can be updated later
        };

        try {
            const res = await fetch(`${BASE_URL}/movies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMovie)
            });

            const data = await res.json();
            console.log('Movie added:', data);
            alert(`Movie "${data.name}" added!`);
            loadMovies();
            e.target.reset();
        } catch (error) {
            console.error('Error adding movie:', error);
            alert('Failed to add movie.');
        }
    });
});
