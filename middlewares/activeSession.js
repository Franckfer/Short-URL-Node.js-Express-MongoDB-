
module.exports = (req, res, next) => {
    
    req.isAuthenticated() //verificamos una sesion activa
    ?
    next()
    : 
    res.redirect('/auth/login')

}