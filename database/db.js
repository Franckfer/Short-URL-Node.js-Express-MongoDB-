const mongoose = require('mongoose');

mongoose.connect(process.env.URI)
    .then(() => console.log('db conectada 🔥🔥🔥'))
    .catch(e => console.log('fallo la conexion 😞: ' + e))
