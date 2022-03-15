const { Router } = require('express');
const router = Router();
const { 
    leerUrl, 
    agregarUrl, 
    eliminarUrl, 
    formDeEdicion, 
    editarUrl, 
    redirec 
} = require('../controllers/homeController');


const activeSession = require('../middlewares/activeSession');
//middleware que determina un usuario en sesion

const urlValida = require('../middlewares/urlValida');
//middleware que determina si llega una url valida antes de agregarla

router.get('/', activeSession, leerUrl);
router.post('/', activeSession, urlValida, agregarUrl);
router.get('/eliminar/:id/', activeSession, eliminarUrl);
router.get('/editar/:id/', activeSession, formDeEdicion);
router.post('/editar/:id/', activeSession, urlValida, editarUrl);
router.get('/:shortUrl', redirec)




module.exports = router;