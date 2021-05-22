const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
  subcategoria: {
    type: Schema.Types.ObjectId,
    ref: "Subcategoria",
    required: true,
  },
  proveedor: {
    type: Schema.Types.ObjectId,
    ref: "Proveedor",
    required: true,
  },
  precio: {
    type: String,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  unidadMedida: {
    type: String,
    required: true,
  },
});

ProductoSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("Producto", ProductoSchema);
