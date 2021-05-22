const { Schema, model } = require('mongoose');

const ProveedorSchema = Schema({

    nombre: {
        type: String,
        required: true,
        unique: true
    },
    categoria: {
        type: String,
        required: true
    },
    poblacion: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true,
        unique: true
    },
    cif: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String
    },
    web: {
        type: String
    }
});


ProveedorSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})



module.exports = model('Proveedor', ProveedorSchema);