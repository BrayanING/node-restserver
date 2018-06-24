const express = require('express');
const app = express();
const {verificaTokenImg} = require('../middlewares/autenticacion');
//para obtener el archivo y la ruta de la ubicacion de la imagen
const fs = require('fs');
const path = require('path');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    }else{
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }
});


module.exports = app;
