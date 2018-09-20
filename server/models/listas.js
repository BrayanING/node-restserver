const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let listaSchema = new Schema({
    descripcion: {
        type: String,
        uinque: true,
        required: [true, 'La lista es requreida']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

let listaSchema = new Schema({
    descripcion: {
        type: String,
        uinque: true,
        required: [true, 'La lista es requreida']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);
