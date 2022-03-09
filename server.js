///////////////////////////////
//Import dependencies
//////////////////////////////
require("dotenv").config(); // Load ENV Variables
const express = require("express"); // import express
const morgan = require("morgan"); //import morgan
const methodOverride = require("method-override");
// const mongoose = require("mongoose");
// const path = require("path")

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

///////////////////////////////
//Routes
//////////////////////////////
app.get('/', (req, res)=>{
    res.send('your server is running better go catch it')
})





///////////////////////////////
//Server Listener
//////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log('app is listening on port: ', PORT)
})