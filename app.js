// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
//require('./db');
const mongoose = require('mongoose');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();
mongoose.set('strictQuery', false);

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lab-express-cinema', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error(error.message));

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-express-cinema';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const Movie = require('./models/Movie.model');

app.get('/movies', (req, res, next) => {
  Movie.find()
    .then((movies) => {
      res.render('movies', { movies });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});



app.get('/movie/:id', (req, res, next) => {
  const { id } = req.params;

  Movie.findById(id)
    .then((movie) => {
      res.render('movie-details', { movie });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
