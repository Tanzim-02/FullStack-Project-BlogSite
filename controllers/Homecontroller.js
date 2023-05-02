const Flash = require('../utils/Flash')


const HomePage = (req, res,next) =>{

    res.render('pages/Home/home', {
        // title: 'My Dashboard',
        flashMessage: Flash.getMessage(req)
    })
}

module.exports = HomePage;