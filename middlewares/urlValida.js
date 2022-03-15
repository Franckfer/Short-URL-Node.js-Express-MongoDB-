const { log } = require('console');
const { URL } = require('url');

module.exports = (req, res, next) => {

    try {
        const { origin } = req.body;
        const urlFrontend = new URL(origin);

        //si la propiedad origin de urlFrontend es distinta al string "null" quiere decir que es una url valida.
        if (urlFrontend.origin !== "null") {
            if (
                urlFrontend.protocol === "http:" ||
                urlFrontend.protocol === "https:"
            ) {
                return next();
            }

            throw new Error("debe tener el formato 'http://' o 'https://'");
        }

        throw new Error("Url no válida 😲");


    } catch (error) {

        if (error.code === 'ERR_INVALID_URL') {
            req.flash('mensajes', [{ msg: 'URL no válida' }]);        
        } else {
            req.flash('mensajes', [{ msg: error.message }]);        
        }

        return res.redirect('/');
    }

};

