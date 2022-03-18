const User = require('../models/User');
const path = require("path");
const formidable = require("formidable");
const Jimp = require("jimp");
const fs = require('fs');


module.exports = {
    
    formProfile: async (req, res) => {

        try {
            const user = await User.findById(req.user.id);
            return res.render('profile', {
                user: req.user,
                image: user.image
            })

        } catch (error) {
            req.flash('mensajes', [{ msg: "Error al intentar leer el usuario" }]);
            return res.redirect('/perfil')
        }
        
    },
    editProfile: async (req, res) => {
        
        const form = new formidable.IncomingForm();

        form.maxFileSize = (10 * 1024 * 1024);

        form.parse(req, async(err, fields, files) => {

            try {

                if (err) {
                    throw new Error('fallo la subida de imagen')
                }

                const myFile = files.myFile;

                if (myFile.originalFilename === '') {
                    throw new Error('Debes agregar una imagen')
                }

                const typeImage = ['image/jpeg', 'image/png'];

                if (!typeImage.includes(myFile.mimetype)) {
                    throw new Error('El formato aceptado es .jpg o .png')
                }
                
                if (myFile.size > (10 * 1024 * 1024)) {
                    throw new Error('La imagen no puede superar los 10 mb ')
                }

                const getExtension = myFile.mimetype.split('/')[1]; //obtenemos el tipo de extension 
                const nameImg = `${req.user.id}.${getExtension}`
                
                
                const dirImage = path.join(          // carpeta donde se guardan las imagenes
                    __dirname, `../public/img/profiles/${nameImg}`
                );

                fs.renameSync(myFile.filepath, dirImage);
                //renombramos el directorio de nuestra imagen actual cargada
                //por el directorio donde queremos guardar nuestras imagen

                const resizeImg = await Jimp.read(dirImage);
                resizeImg.resize(250, 250).quality(100).writeAsync(dirImage)
                // calidad y tamaño de la imagen

                const user = await User.findById(req.user.id);
                user.image = nameImg;
                await user.save();

                req.flash('mensajes', [{ msg: "Se actualizo la imagen"}]);

            } catch (error) {

                req.flash('mensajes', [{ msg: error.message }]);

            } finally {

                return res.redirect('/perfil');
            }

        })

    }
    
}