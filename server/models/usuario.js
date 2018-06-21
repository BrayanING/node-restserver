const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//Creacion de objeto
let Schema = mongoose.Schema;

//Roles validos
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role valido'
};

//los campos que tendra la coleccion de datos 
let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});

//Creamos un metodo para eliminar el password para no mostrarlo en la peticion
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

//Usar el plugin
usuarioSchema.plugin(uniqueValidator,{message: '{PATH} debe ser unico' });
module.exports = mongoose.model('Usuario', usuarioSchema);