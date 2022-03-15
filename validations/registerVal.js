const { body } = require('express-validator');

module.exports = [

    body('userName')
        .trim()
        .notEmpty()
        .withMessage('Ingrese un nombre válido')
        .escape()
        .isLength({ min: 2 })
        .withMessage('El nombre debe tener como minimo dos caracteres'),

    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Ingrese un email  válido'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Debes escribir tu contraseña')
        .escape()
        .isLength({ min: 6})
        .withMessage('Contraseña de minimo 6 caracteres')
        .custom((value, {req}) => 
            value !== req.body.repassword //si el value(password) es distinto a req.body.repassword
            ?
            false  // si es falso las contraseñas no coinciden
            :
            value // si no retornamos el valor
        )
        .withMessage('No coinciden las contraseñas')

]