const setLocals =()=>{
    return (req, res, next) =>{
        res.locals.user= req.user

        res.locals.isLoggedIn =req.session.isLoggedIn

        next()
    }
}


module.exports = setLocals