const { Schema, model } = require("mongoose");

const SubcategoriaSchema = Schema({
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
});

SubcategoriaSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("Subcategoria", SubcategoriaSchema);
