const monoose = require('mongoose');
const { type } = require('os');

// Define the person schema
const personSchema = new monoose.Schema({
    name : {
        type: String,
        required: true,        
    },
    age:{
        type: Number
    },
    work : {
        type: String,
        enum:['Chef', 'Waiter', 'Manager'],
        required : true
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    address:{
        type: String,
    },
    salary:{
        type: Number,
        required: true
    }
})

// Create Model
const Person = monoose.model('Person', personSchema);
module.exports = Person;