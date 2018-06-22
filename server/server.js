require('./config/config')
const express = require ('express');
const app = express();
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');

//declarar el path
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded ({extended: false}));

// parse application/json
app.use(bodyParser.json ());

//habilitar la carpeta public para acceder desde cualquier lugar
app.use(express.static(path.resolve(__dirname, "../public")));

//acceder ruta index
//configuracion de rutas globales
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
  console.log(`Escuchando en el puerto ${process.env.PORT}`);
});
