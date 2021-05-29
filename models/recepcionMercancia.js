const { Schema, model } = require("mongoose");

const RecepcionMercanciaSchema = Schema({
  numPedido: {
    type: String,
    required: true,
    unique: true,
  },
  fechaRecepcion: {
    type: String,
    required: true,
  },
  proveedor: {
    type: Schema.Types.ObjectId,
    ref: "Proveedor",
    required: true,
  },
  productos: {
    type: [],
    required: true,
  },
});

RecepcionMercanciaSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("RecepcionMercancia", RecepcionMercanciaSchema);
