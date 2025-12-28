// Import express
const express = require('express');

// Create an Express app
const app = express();
const db = require('./db')

require('dotenv').config();

const passport = require('./auth')

const bodyParser = require('body-parser');

app.use(bodyParser.json());
// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Start the server on port 3000
const PORT = process.env.PORT || 3000;

// Middleware Function 
const logRequest = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Request Made to : ${req.originalUrl}`)
    next()  // move on to the next phase
}

app.use(logRequest)

app.use(passport.initialize())

// Define a route (endpoint)
const locaAuthMiddleware = passport.authenticate('local', { session: false })
app.get('/', (req, res) => {
    res.send('Hello from Express.js server!');
});

// import the roouter files
const personRoutes = require('./routes/personRoutes')
const menuItemRoutes = require('./routes/menuItemRoutes');

// use the routers
app.use('/person', personRoutes);
app.use('/menu', menuItemRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// comment for testing