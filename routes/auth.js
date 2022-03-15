const { Router } = require('express');
const router = Router();
const registerVal = require('../validations/registerVal');
const loginVal = require('../validations/loginVal');
const { 
    loginForm, 
    loginUser, 
    registerForm, 
    registerUser, 
    confirmarCuenta, 
    logout
} = require('../controllers/authController');



router.get('/login', loginForm);
router.post('/login', loginVal, loginUser);
router.get('/register', registerForm);
router.post('/register', registerVal, registerUser);
router.get('/confirmar-cuenta/:token', confirmarCuenta);
router.get('/logout', logout);





module.exports = router;