
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/movieDB')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Movie Schema
const movieSchema = new mongoose.Schema({
    title: String,
    genre: String,
    year: Number,
    rating: Number,
    director: String
});

const Movie = mongoose.model('Movie', movieSchema);

// Add Movie
app.post('/movies', async (req, res) => {
    const movie = new Movie(req.body);
    await movie.save();
    res.send('Movie Added Successfully');
});

// View All Movies
app.get('/movies', async (req, res) => {
    const movies = await Movie.find();
    res.json(movies);
});

// Search Movie
app.get('/search', async (req, res) => {
    const q = req.query.q || '';
    const movies = await Movie.find({
        $or: [
            { title: { $regex: q, $options: 'i' } },
            { genre: { $regex: q, $options: 'i' } }
        ]
    });
    res.json(movies);
});

// Update Movie
app.put('/movies/:id', async (req, res) => {
    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(movie);
});

// Delete Movie
app.delete('/movies/:id', async (req, res) => {
    await Movie.findByIdAndDelete(req.params.id);
    res.send('Movie Deleted Successfully');
});

// Start Server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
