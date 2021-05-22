const { Schema, model } = require('mongoose');

const ClienteSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true,
        unique: true
    },
    poblacion: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    telefono: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String
    },
    dni: {
        type: String
    }
});


ClienteSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})



module.exports = model('Cliente', ClienteSchema);
