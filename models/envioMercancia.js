const { Schema, model } = require("mongoose");

const EnvioMercanciaSchema = Schema({
  numEnvio: {
    type: String,
    required: true,
    unique: true,
  },
  fechaEnvio: {
    type: String,
    required: true,
  },
  cliente: {
    type: Schema.Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  productos: {
    type: [],
    required: true,
  },
});

EnvioMercanciaSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("EnvioMercancia", EnvioMercanciaSchema);
