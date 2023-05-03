const authRoute = require('./authRoute');
const dashboard =require('./dashboardRoute');
const homePage = require('./home');
const playground = require('../playground/play')
const uploadRoute = require('./uploadRoutes')
const postRoute = require('./postRoute');

const apiRoute = require('../api/routes/apiRoutes');

const exploreController= require('./exploreRoute');

const routes = [
    {
        path: '/auth',
        handler: authRoute
    },
    {
        path: '/dashboard',
        handler: dashboard
    },
    {
        path: '/uploads',
        handler: uploadRoute
    },

    {
        path: '/post',
        handler:postRoute

    },
    {
        path: '/api',
        handler: apiRoute
    },
    {
        path: '/explorer',
        handler: exploreController
    },



    {
        path: '/playground',
        handler: playground
    },
    {
        path: '/',
        handler: homePage
    },
    


]

module.exports = app => {
    routes.forEach(r=>{
        if (r.path === '/') {
            app.get(r.path, r.handler)
        } else {
            app.use(r.path, r.handler)
        }
    })

}