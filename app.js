const mongoose = require("mongoose");
const express = require("express");
const expressLayout = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const methodOverride = require("method-override");

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 8000 ;

//connect to DB
connectDB();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: 'richard feynman',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}))

//middleware
app.use(express.static('public')); // serving static files via express
app.use(expressLayout); // using ejs layouts
app.set('layout', './layouts/main'); // layout of the website will be @ ./layouts/main
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main')); 
app.use('/', require('./server/routes/user')); 


app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
})

