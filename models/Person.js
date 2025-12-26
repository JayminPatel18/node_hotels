const monoose = require('mongoose');
const bcrypt = require('bcrypt');

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
        enum:['Chef', 'Waiter', 'Manager','Cashier', 'Store Assistant'],
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
    },
    username:{
        type: String,
        required : true,
    }, 
    password : {
        type: String,
        required: true
    }

})

personSchema.pre('save', async function(){
    const person = this;

    // Hash the password only if it has been modified (or is new)
    if(!person.isModified('password')){
        return ;
    }

    try {
        // hash password generate
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);

        // override the plain password with the hashed one
        person.password = hashedPassword;
        
    } catch (err) {
        throw err;
    }
})

personSchema.methods.comparePassword = async function(candidatePassword){
    try {
        // use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password)
        return isMatch;
    } catch (err) {
        throw err;
    }
}

// Create Model
const Person = monoose.model('Person', personSchema);
module.exports = Person;