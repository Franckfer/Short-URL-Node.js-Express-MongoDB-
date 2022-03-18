const Url = require('../models/Url');
const { nanoid } = require('nanoid')


module.exports = {

    leerUrl : async (req, res) => {

        try {
            //el metodo lean() permite mandar JS a las vistas hbs
            //buscamos las url relacionadas al usuario en sesion
            const urls = await Url.find({user: req.user.id}).lean() 
            return res.render('home' , {urls});

        } catch (error) {
            req.flash('mensajes', [{ msg: error.message }]);
            return res.redirect('/')        
        }

    },
    agregarUrl : async (req, res) => {

        const {origin} = req.body;

        try {

            const url = new Url({
                origin, 
                shortURL: nanoid(8),
                user: req.user.id
            })
            
            await url.save()

            req.flash('mensajes', [{ msg: 'URL agregada'}]);

            res.redirect('/')

        } catch (error) {
            req.flash('mensajes', [{ msg: error.message }]);
            return res.redirect('/')   
        }
    },
    formDeEdicion : async (req,res) => {

        const {id} = req.params;

        try {
            
            const url = await Url.findById(id).lean();

            if(!url.user.equals(req.user.id)) { //verifico que la url le pertenezca al usuario en sesion
                throw new Error('Esta url no le pertenece a este usuario')
            }

            return res.render('home', { url })

        } catch (error) {

            req.flash('mensajes', [{msg: error.message}]);
            return res.redirect('/')   
        }

    },
    editarUrl : async (req,res) => {

        const { id } = req.params;
        const { origin } = req.body;

        try {

            //await Url.findByIdAndDelete(id);
            const url = await Url.findById(id)  //obtengo la url por el id

            if(!url.user.equals(req.user.id)) { //verifico que la url le pertenezca al usuario en sesion
                throw new Error('Esta url no le pertenece a este usuario')
            }
            
            await url.updateOne({origin})
            //await Url.findByIdAndUpdate(id, {origin});
            
            res.redirect('/')

        } catch (error) {

            req.flash('mensajes', [{msg: "No existe esta URL"}]);
            return res.redirect('/auth/login')   
        }
        
    },
    eliminarUrl : async (req,res) => {
        //params hace referencia al id recibido por la url 
        const { id } = req.params;

        try {

            //await Url.findByIdAndDelete(id);
            const url = await Url.findById(id)  //obtengo la url por el id

            if(!url.user.equals(req.user.id)) { //verifico que la url le pertenezca al usuario en sesion
                throw new Error('Esta url no le pertenece a este usuario')
            }

            await url.remove()

            res.redirect('/')
            
        } catch (error) {
            req.flash('mensajes', [{msg: error.message}]);
            return res.redirect('/')   
        }
    },
    redirec: async (req, res) => {
        const { shortUrl } = req.params;

        try {

            const urlDB = await Url.findOne({shortURL: shortUrl});
            res.redirect(urlDB.origin)

        } catch (error) {
            req.flash('mensajes', [{msg: error.message}]);
            return res.redirect('/')   
        }
    }

};