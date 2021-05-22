const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
});

CategoriaSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("Categoria", CategoriaSchema);
