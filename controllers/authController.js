const User = require("../models/User");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const {nanoid} = require('nanoid');
const { validationResult } = require("express-validator");


module.exports = {
    
    loginForm: async (req, res) => {
        res.render('login')
    },
    loginUser: async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {    //si hay errores
            req.flash('mensajes', errors.array());
            return res.redirect('/auth/login');
            //return res.json(errors.mapped()); // return corta la ejecucion de lo que sigue y muestra los errores
            //return res.json(errors.array()); // array de objetos de los errores
        }

        const {email, password} = req.body;
        
        try {

            let user = await User.findOne({email}); // busco usuario existente

            if (!user) throw new Error('El email no existe'); // sino existe 

            if(!user.cuentaConfirmada) throw new Error('Debes confirmar la cuenta'); // confirmar token
            
            const validPassword = user &&  // si existe valida
            bcrypt.compareSync(password, user.password); // comparo la contraseña del formulario con la contraseña hasheada en la db 

            if (!validPassword || !user) throw new Error('Credenciales invalidas'); // sino existe

            req.login(user, function(err) {
                // Creo la sesion de usuario a travez de passport
                if (err) throw new Error('Error al crear la sesión') 
                
                return res.redirect('/');
            })

            
        } catch (error) {
            //res.json({error: error.message})
            req.flash('mensajes', [{msg: error.message}]);
            return res.redirect('/auth/login');

        }
    },
    registerForm: (req, res) => {
        res.render('register')
    },
    registerUser: async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {    //si hay errores
            req.flash('mensajes', errors.array());
            return res.redirect('/auth/register');  //return corta la ejecucion de lo que sigue y muestra los errores
        }
       
        const {userName, email, password} = req.body;

        try {

            let user = await User.findOne({email: email});

            if (user) throw new Error('El usuario ya existe')

            user = new User({userName, email, password, tokenConfirm: nanoid() });
            user.password = bcrypt.hashSync(password, 12);

            await user.save()

            /*  ENVIAR CORREO CON LA CONFIRMACION DE LA CUENTA */
            const transport = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: process.env.userNodemailer,
                  pass: process.env.passNodemailer
                }
            });

            // send mail with defined transport object
            await transport.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: user.email, // list of receivers
                subject: "Verifica tu cuenta de correo", // Subject line
                text: "Hello world?", // plain text body
                html: `<a href="http://localhost:5000/auth/confirmar-cuenta/${user.tokenConfirm}">Verifica tu cuenta aqui</a>`, // html body
            });

            req.flash('mensajes', [{msg: 'Revisa tu correo electronico para validar esta cuenta'}]);

            res.redirect('/auth/login');
            
            
        } catch (error) {
            req.flash('mensajes', [{msg: error.message}]);
            return res.redirect('/auth/register');
        }
    },
    confirmarCuenta: async (req,res) => {

        const { token } = req.params

        try {
            const user = await User.findOne({tokenConfirm : token});

            if(!user) throw new Error('El usuario no existe');

            user.cuentaConfirmada = true;
            user.tokenConfirm= null;
            await user.save();

            req.flash('mensajes', [{msg: 'Cuenta verificada, puedes iniciar sesión.'}]);

            res.redirect('/auth/login');

        } catch (error) {
            req.flash('mensajes', [{msg: error.message}]);
            return res.redirect('/auth/login');
        }
    },
    logout : (req, res) => {
        req.logout();
        return res.redirect('/auth/login');
    }
    
}