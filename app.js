const express = require('express');
const moongose = require('mongoose');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv= require('dotenv');
const PORT = process.env.PORT || 5000;

dotenv.config()

const MONGODB_URI=process.env.MONGODB_URI_URL;



const setMiddleware = require('./middleware/middlewares')
const setRoutes = require('./routes/routes');

//setup view engine
app.set('view engine', 'ejs'); 
app.set('views', 'views');  


//useing MiddlleWare from MiddleWare Directory
setMiddleware(app)

//useing routes from routes Directory
setRoutes(app);

app.use((req, res,next)=>
{
    let error = new Error ('404 Page Not Found')
    error.status =404
    next(error)
})

app.use ((error, req, res, next)=>{
    if (error.status === 404) {
        return res.render('pages/error/404.ejs', {flashMessage: {},
        title: '404 Not Found'
    })
    }

    console.log(error);

    res.render('pages/error/500', {
        flashMessage: {}
    })

})


//connection......

moongose.connect(MONGODB_URI, {
    useNewUrlParser: true
})
.then(()=>{
    console.log(('Database connected'));
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    
})
.catch(e=>{
    
    console.log(e);
})







