const express = require('express');
const session = require('express-session');
var flash = require('connect-flash');
const passport = require('passport');
const User = require('./models/User');
const csrf = require('csurf');
const { create } = require('express-handlebars');
require('dotenv').config()
require('./database/db')

const app = express();


//middlewares
app.use(session({
    secret: process.env.SecretSession,
    resave: false,
    saveUninitialized: false,
    name: 'mynameis'
}));
app.use(flash());


/* Passport */
app.use(passport.initialize());
app.use(passport.session());

/*  Serializacion : al loguearnos generamos/creamos una sesion con el usuario guardado en la DB  */
passport.serializeUser((user, done) =>  // serializeUser recibe el usuario de la DB y el metodo done que guarda la sesion
    done(null, {                        // en el callback pasamos null(no hubo errores)
        id: user._id,                   // en el objeto mandamos datos del modelo(User) al req.user para poder verificar que el usuario este logueado
        userName: user.userName
    })
)
/*  Deserializacion : actualiza y mantiene la sesion del usuario activa en las distintas vistas*/
passport.deserializeUser( async (user, done) => {
    const userDB = await User.findById(user.id)    // Busco y verifico que el usuario exista en la base de datos
    return done(null, {                            // devolvemos un mensaje y la sesion activa del usuario de la DB
        id: userDB._id,
        userName: userDB.userName
    })  
})




const hbs = create({
    extname: '.hbs',
    partialsDir: ['views/components']
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));

//evita el ataque de falsificación de requests entre sitios (CSRF)
app.use(csrf())
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.mensajes = req.flash('mensajes')
    next()
    //variable global que envia el token a todos los formularios
    //y los mensajes a todas la vistas
})

app.use('/', require('./routes/home'));
app.use('/auth', require('./routes/auth'));



const PORT = process.env.PORT || 5000
app.listen(PORT, () => 
    console.log('servidor con express corriendo 🚀🚀 puerto ' + PORT)
)