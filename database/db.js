const mongoose = require('mongoose');

const clientDB = mongoose.connect(process.env.URI)
    .then((m) => {
        console.log('db conectada 🔥🔥🔥')
        return m.connection.getClient()
    })
    .catch(e => console.log('fallo la conexion 😞: ' + e))


module.exports = clientDB