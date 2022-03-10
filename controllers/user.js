///////////////////////////////
//Import Dependencies
//////////////////////////////
const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

///////////////////////////////
//Create router
//////////////////////////////
const router = express.Router()



///////////////////////////////
//Routes
//////////////////////////////

//two signup routes
//get to render the signup form
router.get('/signup', (req, res)=>{
    res.render('users/signup')
})
//post to send the signup info
router.post('/signup', async (req, res)=>{
    // console.log('initial req.body in signup: ', req.body)
    //first encryp our password
    req.body.password = await bcrypt.hash(
        req.body.password, 
        await bcrypt.genSalt(10)
    )
    // console.log('req.body after hash', req.body)
    //create a new user
    User.create(req.body)
    //if created successfully redirect to login
        .then(user =>{
            res.redirect('/user/login')
        })
    //if an error occurs, send err
        .catch(err =>{
            console.log(err)
            res.json({err})
        })

})

//two login routes
//get to render the login form
router.get('/login', (req, res)=>{
    res.render('users/login')
})
//post to send the login info(and create a session)
router.post('/login', async (req, res)=>{
    //get the data from the request body
    const {username, password} = req.body
    //search for the user
    User.findOne({username})
        .then(async (user)=>{
            //check if the user exists
            if(user){
            //compare the password
            //bcrypt.compare evaluates to a truthy or a falsy value
            const result = await bcrypt.compare(password, user.password)
            if(result){
                //then we'll need to use the session object
                //store some properties in the session
                req.session.username = username
                req.session.loggedIn = true
                //redirect to /fruits if login is successful
                res.redirect('/fruits')
                //send an error if the password doesn't match
            } else {
                res.json({error: 'username or password incorrect'})
            }
            ///send an error if the user doesn't exist
        } else {
            res.json({error: 'user does not exist'})
        }
        
    })
    //catch any other errors that occur
        .catch(err =>{
            console.log(err)
            res.json(err)
        })
})

//logout route
router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        console.log(err)
        res.send('session has been destroyed')
    })
})

//signout route -> destroy the session

///////////////////////////////
//export the router
//////////////////////////////
module.exports = router