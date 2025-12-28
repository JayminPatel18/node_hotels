const express = require('express')
const router = express.Router();
const Person = require('../models/Person.js');
const { jwtAuthMiddleware, generateToken } = require('./../jwt.js')

// make post method 
router.post('/signup', async (req, res) => {
    try {
        const data = req.body // Assuming the request body contains the person data

        // Create a new Person document using the MongoDB model
        const newPerson = new Person(data);

        // save the new Person to the database
        const response = await newPerson.save()
        console.log('data saved')

        const payload = {
            id: response.id,
            username: response.username
        }
        console.log(JSON.stringify(payload))

        const token = generateToken(payload)
        console.log("Token is ", token)
        res.status(200).json({ response: response, token: token })

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'Signup : Internal Server Error' })
    }
})

// Login user
router.post("/login", async (req, res) => {
    try {
        // Extract username and password from request body
        const { username, password } = req.body;

        // Find the user by username
        const user = await Person.findOne({ username: username });

        // if user does not exist or pasword does not match, return error 
        if (!user || !(await user.comparePassword(password))) {
            return res.status(404).json({ error: 'Invalid username or password' })
        }
        // generate token 
        const payload = {
            id: user.id,
            username: user.username
        }

        const token = generateToken(payload)

        // return token as response
        res.json({ token })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login in : Internal Server error' })
    }
})

// Profile route
router.get('/profile', jwtAuthMiddleware, async(req, res) =>{
    try {
        const userData = req.user;
        console.log("User Data : ", userData)

        const userId = userData.id;
        const user = await Person.findById(userId);

        res.status(200).json({user})
    } catch (err) {
        console.log(err);
        res.status(500)({error: 'Profile : Internal Server Error'})
    }
})

// GET Method to get the person
router.get('/', jwtAuthMiddleware,async (req, res) => {
    try {
        const data = await Person.find();
        console.log('data fetched')
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'Get All User: Internal Server Error' })
    }
})


// Parameterized API
router.get('/:workType', async (req, res) => {
    try {
        // Extract the work type from the URL parameter
        const workType = req.params.workType;
        if (workType == 'Chef' || workType == 'Manager' || workType == 'Waiter') {
            const response = await Person.find({ work: workType })
            console.log('response fethed')
            res.status(200).json(response);
        } else {
            res.status(404).json({ error: 'Invalid work type' })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Get Work type : Internal Server Error' })
    }
})

// Put method try to Update data
router.put('/:id', async (req, res) => {
    try {
        // Extract the id from the URL parameter
        const personID = req.params.id;
        const updatedPersonData = req.body;

        const response = await Person.findByIdAndUpdate(personID, updatedPersonData, {
            new: true,  // return the updated document
            runValidators: true, // Run MongoDB validation
        })

        if (!response) {
            return res.status(404).json({ error: 'Person is not Found' })
        }

        console.log('data updated');
        res.status(200).json(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Person Update data : Internal Server Error' })
    }
})

// Delete method to delete document by ID
router.delete('/:id', async (req, res) => {
    try {
        const personId = req.params.id; // Extract the person's ID from the URL parameter

        // Assume you have a Person model
        const response = await Person.findByIdAndDelete(personId);

        if (!response) {
            return res.status(404).json({ error: 'Person is not Found' })
        }

        console.log('data deleted');
        res.status(200).json({ message: 'person deleted success' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Delete data : Internal Server Error' })
    }
})

module.exports = router;