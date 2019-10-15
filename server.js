// Dependencies ************************************************
const express = require('express');
const mongoose = require('mongoose');
//const cors = require('cors');
// const axios = require('axios');
const path = require('path');

// Initialize Express Server
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(cors());

// Set port
const PORT = process.env.PORT || 4000;

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// Connect to the Mongo DB **********************************************
// If deployed, use the deployed database. Otherwise use the local database
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rally';

// Connect to the db
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    // Display the connection message
    console.log('MongoDB database connection established successfully');
  })
  .catch(function(err) {
    // If an error occurred, log it
    console.log(err);
  });

// Require routes
const UsersRoutes = require('./Routes/rally');

//! Do we want all base of rally or root?????
// Sets the base route as localhost:4000/rally
// All routes will be off rally
app.use('/rally', UsersRoutes);

// Send every other request to the React app
// Define any API routes before this runs
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

// Start the server **********************************************
app.listen(PORT, function() {
  console.log(`App running on port ${PORT}!`);
});
