///////////////////////////////
//Import Dependencies
//////////////////////////////
const express = require('express')
const Fruit = require('../models/fruit')


///////////////////////////////
//Create router
//////////////////////////////
const router = express.Router()

///////////////////////////////
//Router Middleware
//////////////////////////////
//create middleware to protect these routes
//authorization middleware
router.use((req, res, next)=>{
    //checking the loggedIn boolean of our session
    if (req.session.loggedIn){
        //if they're logged in, go to the next thing(that's the controller)
        next()
    } else {
        //if they're not logged in, send them to the login page
        res.redirect('/user/login')
    }
})


///////////////////////////////
//Routes
//////////////////////////////
// router.get('/', (req, res)=>{
//     res.send('your server is running better go catch it')
// })

// router.get('/fruits/seed', (req, res)=>{
//     //arr of starter fruits
//     const startFruits = [
//         { name: "Orange", color: "orange", readyToEat: false },
//         { name: "Grape", color: "purple", readyToEat: false },
//         { name: "Banana", color: "orange", readyToEat: false },
//         { name: "Strawberry", color: "red", readyToEat: false },
//         { name: "Coconut", color: "brown", readyToEat: false },
//     ]
//       //when we seed data, there are a few steps involved
//       //delete all the data that already exists(will only happen if data exists)
//       Fruit.remove({})
//         .then(data => {
//             console.log('this is what remove returns', data)
//             //then we create our seed data
//             Fruit.create(startFruits)
//                 .then(data => {
//                     console.log('this is what create returns', data)
//                     res.send(data)
//                 })
//         })
//       //then we can send if we want to see that data
// })

//index route for ALL the fruits
router.get('/', (req, res)=>{
    //find the fruits
    Fruit.find({})
    //then render a template AFTER they're found
        .then(fruits =>{
            console.log(fruits)
            res.render('fruits/index', { fruits })
        })
    //show an error if there is one
        .catch(error => {
            console.log(error)
            res.json({error})
        })
})

//Index that shows only the user's fruits
router.get('/mine', (req, res)=>{
    //find the fruits
    Fruit.find({username: req.session.username})
    //then render a template AFTER they're found
        .then(fruits =>{
            console.log(fruits)
            res.render('fruits/index', { fruits })
        })
    //show an error if there is one
        .catch(error => {
            console.log(error)
            res.json({error})
        })
})

//new route -> GET route that renders our page with the form
router.get('/new', (req, res) =>{
    res.render('fruits/new')
})


//create route -> POST route that actually calls the db and makes a new document
router.post('/', (req, res)=>{
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false
    console.log('this is the fruit to create', req.body)
    //now we're ready for mongoose to do its thing
    //now that we have user specific fruits, we'll add the username to the fruit created
    req.body.username = req.session.username
    Fruit.create(req.body)
        .then(data =>{
            console.log('this was returned from create ', data)
            res.redirect('/fruits')
        })
        .catch(err =>{
            console.log(err)
            res.json({err})
        })
})

router.get('/:id/edit', (req, res)=>{
    const fruitId = req.params.id
    Fruit.findById(fruitId)
        .then(fruit =>{
            res.render('fruits/edit', {fruit})
        })
        .catch(err =>{
            console.log(err)
            res.json({err})
        })
})

router.put('/:id', (req, res)=>{
    const fruitId = req.params.id
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false
    Fruit.findByIdAndUpdate(fruitId, req.body, {new: true})
        .then(fruit =>{
            console.log(fruit)
            res.redirect(`/${fruitId}`)
        })
        .catch(err =>{
            console.log(err)
            res.json({err})
        })
})


//show route
router.get('/:id', (req, res)=>{
    //first, we need to get the id
    const fruitId = req.params.id
    //then we can find a fruit by its id
    Fruit.findById(fruitId)
    //once found we can render a view with the data
        .then(fruit =>{
            res.render('fruits/show', {fruit})
        })
    //if there is an error, show that instead
        .catch(err =>{
            console.log(err)
            res.json({err})
        })
})

router.delete('/:id', (req, res)=>{
    const fruitId = req.params.id
    Fruit.findByIdAndRemove(fruitId)
        .then(fruit => {
            console.log('this is the response from FBID', fruit)
            res.redirect('/fruits')
        })
        .catch(err =>{
            console.log(err)
            res.json({err})
        })
})


///////////////////////////////
//export the router
//////////////////////////////
module.exports = router