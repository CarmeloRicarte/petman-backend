const { Schema, model } = require("mongoose");

const VentaSchema = Schema({
  cliente: {
    type: Schema.Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  productos: {
    type: Schema.Types.Array,
    ref: "Producto",
    required: true,
  },
  importeTotal: {
    type: Number,
  },
  formaPago: {
    type: String,
  },
  fechaVenta: {
    type: Date,
  },
});

VentaSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("Venta", VentaSchema);
