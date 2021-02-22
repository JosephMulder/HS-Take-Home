const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const peopleSet = new Set();

const { validatePersonField } = require("./utils/validator");

peopleSet.add({
    "firstName": "Joseph",
    "lastName": "Mulder",
    "dateOfBirth": "1995/10/05",
    "emailAddress": "josephmulder800@gmail.com",
    "socialSecurityNumber": "123456789"
})

app.use(express.json());

app.listen(port, () => {
    console.log("server is running on port: " + port);
});

app.get('/person', (req, res) => {
    try {
        const allPeople = [...peopleSet];

        if (allPeople) {
            return res.status(200).send(allPeople);
        }

        res.status(500).send({ error: "Set not initialized" });
    } catch(err) {
        res.status(500).send({ error: err });
    }
});

app.get('/person/:socialSecurityNumber', (req, res) => {
    try {
        const allPeople = [...peopleSet];
        const { socialSecurityNumber } = req.params;
        const match = allPeople.find((person) => person.socialSecurityNumber === socialSecurityNumber);
        if (match) {
            return res.status(200).send(match);
        }
        res.status(400).send({ error: "Social Security Number not found" });
    } catch (err) {
        res.status(500).send({ error: err });
    }
});

app.post('/person', (req, res) => {
    try {
        const { firstName, lastName, dateOfBirth, emailAddress, socialSecurityNumber } = req.body;
        const requiredFields = ["firstName", "lastName", "dateOfBirth", "emailAddress", "socialSecurityNumber"];
        const missingFields = [];
        const invalidFields = [];
    
        requiredFields.forEach((field) => {
            if (req.body[field] === undefined || req.body[field] === "") {
                missingFields.push(field);
            } else {
                !validatePersonField(`${field}`, req.body[field]) ? invalidFields.push(field): null ;
            }
        });
    
        if(missingFields.length > 0 && invalidFields.length > 0) {
            return res.status(400).send({ error: `The following fields are empty or invalid ${missingFields.concat(invalidFields).join(", ")}` });
        } else if (missingFields.length > 0) {
            return res.status(400).send({ error: `The following fields are empty ${missingFields.join(", ")}` });
        } else if (invalidFields.length > 0) {
            return res.status(400).send({ error: `The following fields are invalid ${invalidFields.join(", ")}` });    
        } else {
            const allPeople = [...peopleSet];
            const match = allPeople.find((person) => person.socialSecurityNumber === req.body.socialSecurityNumber);
            if (match) {
                return res.status(400).send({ error: "Duplicate SSN" });
            }
            const newPerson = {
                firstName,
                lastName,
                dateOfBirth,
                emailAddress,
                socialSecurityNumber
            };
            peopleSet.add(newPerson);
            res.status(201).send(newPerson);
        }
    } catch (err) {
        res.status(500).send({ error: err });
    }
});

app.put('/person/:socialSecurityNumber', (req, res) => {
    try {
        const { firstName, lastName, dateOfBirth, emailAddress } = req.body;
        const requiredFields = ["firstName", "lastName", "dateOfBirth", "emailAddress"];
        const missingFields = [];
        const invalidFields = [];
    
        const allPeople = [...peopleSet];
        const match = allPeople.find((person) => person.socialSecurityNumber === req.params.socialSecurityNumber);
        if (match) {// matches
            // validate entries
            requiredFields.forEach((field) => {
                if (req.body[field] === undefined || req.body[field] === "") {
                    missingFields.push(field);
                } else {
                    !validatePersonField(`${field}`, req.body[field]) ? invalidFields.push(field): null ;
                }
            });
    
            if(missingFields.length > 0 && invalidFields.length > 0) {
                return res.status(400).send({ error: `The following fields are empty or invalid ${missingFields.concat(invalidFields).join(", ")}` });
            } else if (missingFields.length > 0) {
                return res.status(400).send({ error: `The following fields are empty ${missingFields.join(", ")}` });
            } else if (invalidFields.length > 0) {
                return res.status(400).send({ error: `The following fields are invalid ${invalidFields.join(", ")}` });    
            } else {// if no invalid or missing fields update
                peopleSet.forEach(person => { //deleting old entry 
                    if (person.socialSecurityNumber === req.params.socialSecurityNumber) peopleSet.delete(person); 
                });
                const updatedPerson = {
                    firstName,
                    lastName,
                    dateOfBirth,
                    emailAddress,
                    socialSecurityNumber: req.params.socialSecurityNumber
                };
                peopleSet.add(updatedPerson);// adding updated one back in
                return res.status(200).send(updatedPerson);
            }
        }
        res.status(400).send({ error: 'Person not found' });
    } catch (err) {
        res.status(500).send({ error: err });
    }
});


app.delete('/person/:socialSecurityNumber', (req, res) => {
    try {
        const { socialSecurityNumber } = req.params;
        let personDeleted = false;
    
        peopleSet.forEach(person => { 
            if (person.socialSecurityNumber === socialSecurityNumber) {
                personDeleted = peopleSet.delete(person);
            }; 
        });
    
        if (personDeleted) {
            return res.status(200).send({ status: "success" });
        }
        
        res.status(400).send({ error: "Nothing deleted"})
    } catch (err) {
        res.status(500).send({ error: err });
    }
});