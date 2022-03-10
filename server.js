///////////////////////////////
//Import dependencies
//////////////////////////////
require("dotenv").config(); // Load ENV Variables
const express = require("express"); // import express
const morgan = require("morgan"); //import morgan
const methodOverride = require("method-override");
const FruitRouter = require('./controllers/fruit')
const UserRouter = require('./controllers/user')
//session middleware requirements
const session = require('express-session')
const MongoStore = require('connect-mongo')

//We no longer need this reference because it lives in the fruit controller now
// const Fruit = require('./models/fruit')

///////////////////////////////
//Create our express application object
//////////////////////////////
const app = require('liquid-express-views')(express())

///////////////////////////////
//Middleware
//////////////////////////////
//this is for request logging
app.use(morgan('tiny'))
app.use(methodOverride('_method'))
//parses urlencoded request bodies
app.use(express.urlencoded({extended: false}))
//to serve files from public statically
app.use(express.static('public'))
//this is the middleware to set up a session
app.use(
    session({
        secret: process.env.SECRET,
        store: MongoStore.create({mongoUrl: process.env.DATABASE_URL}),
        saveUninitialized: true,
        resave: false
    })
)


////////////////////////////
//Use the router
////////////////////////////
//Send all '/fruits' routes to the Fruit Router
app.use('/fruits', FruitRouter)
app.use('/user', UserRouter)




///////////////////////////////
//Server Listener
//////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log('app is listening on port: ', PORT)
})