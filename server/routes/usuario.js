const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const {
    verificaToken,
    verificaAdminRole
} = require('../middlewares/autenticacion');
app.get('/usuarios', verificaToken, (req, res) => {
    return res.json({
        usuario: req.usuario,
        email: req.usuario.email
    });

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde);
    limite = Number(limite);

    Usuario.find({estado:true}, 'nombre email role estado google email')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count({
                        estado: true
                    }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })

            })

        })
});

app.post('/usuarios', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;
    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     });
    // } else {
    //     res.json({
    //         body,
    //     });
    // }
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
});
app.put('/usuarios/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});
app.delete('/usuarios/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    //    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) =>{
    //             if (err) {
    //                 return res.status(400).json({
    //                     ok: false,
    //                     err
    //                 })
    //             }
    //             if(!usuarioBorrado){
    //                    return res.status(400).json({
    //                        ok: false,
    //                        err:{
    //                            message: 'Usuario no encontrado'
    //                        }
    //                    })
    //             }
    //             res.json({
    //                 ok: true,
    //                 usuario: usuarioBorrado
    //             });
    //    })
    let cambioEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambioEstado, {
        new: true,
        runValidators: true
    }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (usuarioBorrado.estado === false) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;