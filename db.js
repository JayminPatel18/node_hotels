const mongoose = require('mongoose');

// Define the MongoDB connection URL
const MongoDBURL = 'mongodb://localhost:27017/hotels'

// set up MongoDB connection
mongoose.connect(MongoDBURL, {
})

// Get the default connection
// Mongoose maintains a default connection object representing the MongoDB connection.
const db = mongoose.connection;

// Define Event Listeners
db.on('connected', () => {
    console.log('Conneted to MongoDB Server')
})
db.on('error', (err) => {
    console.log(`Conneted to MongoDB Server : ${err}`)
})
db.on('disconnected',() =>{
    console.log(`Disconnected to MongoDB server`)
})


// Export the Database Connection
// module.exports = db