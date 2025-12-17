// Import express
const express = require('express');

// Create an Express app
const app = express();
const db = require('./db')

const bodyParser = require('body-parser');

app.use(bodyParser.json());
// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Define a route (endpoint)
app.get('/', (req, res) => {
    res.send('Hello from Express.js server!');
});

// import the roouter files
const personRoutes = require('./routes/personRoutes')
const menuItemRoutes = require('./routes/menuItemRoutes');
// use the routers
app.use('/person', personRoutes);
app.use('/menu', menuItemRoutes);

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});