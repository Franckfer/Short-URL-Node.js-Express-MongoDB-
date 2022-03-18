const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const csrf = require('csurf');
const passport = require('passport');
const User = require('./models/User');
const { create } = require('express-handlebars');
const MongoStore = require('connect-mongo');
require('dotenv').config()
const clientDB = require('./database/db');
const sanitize = require('express-mongo-sanitize');
const cors = require('cors');


const app = express();

const corsOptions = {
    credentials: true,
    origin: process.env.PathHeroku || "*",
    methods: ["GET", "POST"]
}
app.use(cors())

app.use(session({
    secret: process.env.SecretSession,
    resave: false,
    saveUninitialized: false,
    name: 'mynameis',
    store: MongoStore.create({
        clientPromise: clientDB,
        dbName: process.env.DBName
    }),
    cookie: {
        secure: process.env.Modo === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
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

app.use(csrf());    //evita el ataque de falsificación de requests entre sitios (CSRF)
app.use(sanitize()) //evita ataques de inyecciones NoSQL a traves de scripts

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