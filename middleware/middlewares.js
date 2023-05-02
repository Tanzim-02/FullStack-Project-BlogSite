const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const config= require('config')

const {bindUserWithRequest} = require('../middleware/authMiddlewar')

const setLocals = require('../middleware/setLocacal');

const MONGODB_URI=process.env.MONGODB_URI_URL;


const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'Sessions',
    expires: 1000*60*60*48
});



const middleware=[
    morgan('dev'),
    express.static('public'),
    express.json(),
    express.urlencoded({extended:true}),
    session({
        secret: process.env.SEECRET_KEY || 'SECRET',
        resave: false,
        saveUninitialized: false,
        store: store,

    }),
    flash(),
    bindUserWithRequest(),
    setLocals()
]


// app.use(express.urlencoded({extended: true}));



module.exports = app =>{
    middleware.forEach(m=>{
        app.use(m)
    })
}