const { body } = require('express-validator');

module.exports = [

    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Ingrese un email válido'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Debes escribir tu contraseña')
        .escape()
        .isLength({ min: 6})
        .withMessage('Contraseña de minimo 6 caracteres')
        
]