const express = require('express');
let {
    verificaToken,
    verificaAdminRole
} = require('../middlewares/autenticacion');
let app = express();

let Categoria = require('../models/categoria');

//Mostrar todas las categorias
app.get('/categoria', verificaToken,(req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario','nombre email')
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.count((err, conteo) => {
                res.json({
                    ok: true,
                    categoria,
                    cuantos: conteo
                });
            });
        })
});

//Mostrar una categoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {
   let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB)=>{
       if(err){
           return res.status(500).json({
               ok: false,
               err
           });
       }
       if(!categoriaDB){
           return res.status(400).json({
               ok: false,
               err: {
                   message: 'El id no existe'
               }
           });
       }
       res.json({
           ok: true,
           categoriaDB
       })
   })
});

//Crear una nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//Actualizar la categoria
app.put('/categoria/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, {
        new: true,
        runValidators: true
    }, (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//eliminar una categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
let id = req.params.id;
Categoria.findByIdAndRemove(id, (err, categoriaDB)=>{
    if(err){
        return res.status(500).json({
            ok: false,
            err
        });
    }
    if(!categoriaDB){
       return res.status(400).json({
            ok: false,
            err: {
                message: 'El id no existe'
            }
       });
    }

    res.json({
        ok: true,
        err:{
            message: 'Categoria borrada'
        }
    })

});
});

module.exports = app;