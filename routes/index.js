const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie.model.js");
const db = require("../db/index.js");

/* GET home page */
router.get("/", (req, res) => res.render("index"));

// Get movies
router.get("/movies", (req, res) => {
  Movie.find()
    .then((moviesFromDB) => {
      res.render("movies", { movies: moviesFromDB });
    })
    .catch((err) => console.log(err));
});

// Render the creation form
router.get("/movies/create", (req, res) => res.render("create-movies"));

// Create a new movie
router.post("/movies/create", (req, res) => {
  const newMovie = req.body;
  newMovie.stars = ["1", "2"];
  newMovie.showtimes = ["1pm", "5pm"];
  Movie.create(newMovie)
    .then((response) => {
      res.render("action-completed");
    })
    .catch((err) => console.log(err));
});

// Get a single movie
router.get("/movies/:id", (req, res) => {
  console.log(req.params.id); // add this line
    Movie.findById(req.params.id)
    .then((movie) => {
      movie.title = movie.title.toUpperCase();
      res.render("movieDetails", { movie });
    })
    .catch((err) => console.log(err));
});

// Delete a movie
router.post("/movies/:id/delete", (req, res) => {
  Movie.findByIdAndDelete(req.params.id)
    .then((response) => {
      res.render("action-completed");
    })
    .catch((err) => console.log(err));
});

// Show the edit form
router.get("/movies/:id/edit", (req, res) => {
  Movie.findById(req.params.id)
    .then((movieFromDB) => {
      res.render("edit-movie", { movie: movieFromDB });
    })
    .catch((err) => console.log(err));
});

// Edit the movie on the database
router.post("/movies/:id/edit", (req, res) => {
  const editedMovie = req.body;
  Movie.findByIdAndUpdate(req.params.id, editedMovie)
    .then((response) => {
      res.render("action-completed");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
