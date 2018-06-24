const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');
// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: ' No se ha seleccionado ningun archivo'
            }
        });
    }



    //validar tipo de producto o usuarios
    let tiposValidos = ['productos', 'usuarios'];
    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las tipos permitidas son: ' + tiposValidos.join(', ')
            }
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreDividido = archivo.name.split('.');
    let extension = nombreDividido[nombreDividido.length - 1];
    
    //Validar las extensiones
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'Las exstensiones permitidas son: ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }
    
    //Cambiar el nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err)=> {
        if (err){
             return res.status(500).json({
                 ok: false,
                 err
             });
        }
        if(tipo === 'usuarios'){
            imagenUsuario(id, res, nombreArchivo);
        }else{
            imagenProducto(id, res, nombreArchivo);
        }
    });
});



function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB){
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        
        borrarArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado)=>{
            res.json({
                ok: true,
                usuarioGuardado
            });
        });
    })
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB)=>{
        if(err){
            borrarArchivo(nombreArchivo, 'productos');
            res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB){
            borrarArchivo(nombreArchivo, 'productos');
            res.status(400).json({
                ok: false,
                err:{
                    message: 'No existe producto'
                }
            })
        }
        borrarArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado
            });
        });
    });
}

function borrarArchivo(nombreImagen, tipo){
    //ruta de la imagen en particular
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app;