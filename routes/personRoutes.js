const express = require('express')
const router = express.Router();
const Person = require('../models/Person.js');

// make post method 
router.post('/', async (req, res) => {
    try {
        const data = req.body // Assuming the request body contains the person data

        // Create a new Person document using the MongoDB model
        const newPerson = new Person(data);

        // save the new Person to the database
        const response = await newPerson.save()
        console.log('data saved')
        res.status(200).json(response)

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'Internal Server Error' })
    }
})

// GET Method to get the person
router.get('/', async (req, res) => {
    try {
        const data = await Person.find();
        console.log('data fetched')
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'Internal Server Error' })
    }
})


// Parameterized API
router.get('/:workType', async(req, res) => {
    try {
        // Extract the work type from the URL parameter
        const workType = req.params.workType;
        if (workType == 'Chef' || workType == 'Manager' || workType == 'Waiter') {
             const response = await Person.find({work: workType})
             console.log('response fethed')
             res.status(200).json(response);
        }else{
            res.status(404).json({error: 'Invalid work type'})
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'})   
    }
})

// Put method try to Update data
router.put('/:id', async(req, res)=>{
    try{
        // Extract the id from the URL parameter
        const personID = req.params.id;
        const updatedPersonData = req.body;

        const response = await Person.findByIdAndUpdate(personID, updatedPersonData, {
            new: true,  // return the updated document
            runValidators: true, // Run MongoDB validation
        })

        if(!response){
            return res.status(404).json({error: 'Person is not Found'})
        }

        console.log('data updated');
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'})
    }
})

// Delete method to delete document by ID
router.delete('/:id', async(req, res)=>{
    try{
        const personId = req.params.id; // Extract the person's ID from the URL parameter

        // Assume you have a Person model
        const response = await Person.findByIdAndDelete(personId);

        if(!response){
            return res.status(404).json({error: 'Person is not Found'})
        }

        console.log('data deleted');
        res.status(200).json({message: 'person deleted success'});

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'})
    }
})

module.exports = router;