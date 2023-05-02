const router = require('express').Router();
const Upload = require('../middleware/uploadMiddleware')

const {check, validationResult
} = require('express-validator')

const Flash= require('../utils/Flash')

router.get('/play', (req, res) => {
  res.render('playground/play', {
    title: 'Playground',
    error: {},
    flashMessage: {}
  } )
})
router.post('/play',Upload.single('my-file'),
 (req, res,next) => {

  if(req.file){
    console.log(req.file);}

    res.redirect('/playground/play')

})


module.exports=router;