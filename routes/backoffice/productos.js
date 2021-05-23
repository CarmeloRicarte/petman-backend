/*
  Ruta: /api/productos
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const {
  getProductos,
  getProductoById,
  crearProducto,
  actualizarProducto,
  borrarProducto,
  borrarProductosSeleccionados,
} = require("../../controllers/backoffice/productos");
const { validarJWT } = require("../../middlewares/validar-jwt");

const router = Router();

router.get("/", validarJWT, getProductos);

router.get("/:uid", validarJWT, getProductoById);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "El id de la categoría debe de ser válido").isMongoId(),
    check(
      "subcategoria",
      "El id de la subcategoría debe de ser válido"
    ).isMongoId(),
    check("proveedor", "El id del proveedor debe de ser válido").isMongoId(),
    check("precio", "El precio es obligatorio").not().isEmpty(),
    check("precio", "El precio debe tener el formato 0.00").isFloat(),
    check("cantidad", "La cantidad es obligatoria").not().isEmpty(),
    check("cantidad", "La cantidad debe ser un número").isNumeric(),
    check("peso", "El peso es obligatorio").not().isEmpty(),
    check("peso", "El peso debe ser un número").isNumeric(),
    check("unidadMedida", "La unidad de medida es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  crearProducto
);

router.put(
  "/:uid",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "El id de la categoría debe de ser válido").isMongoId(),
    check(
      "subcategoria",
      "El id de la subcategoría debe de ser válido"
    ).isMongoId(),
    check("precio", "El precio es obligatorio").not().isEmpty(),
    check("precio", "El precio debe tener el formato 0.00").isFloat(),
    check("cantidad", "La cantidad es obligatoria").not().isEmpty(),
    check("cantidad", "La cantidad debe ser un número").isNumeric(),
    check("unidadMedida", "La unidad de medida es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  actualizarProducto
);

router.delete("/:uid", validarJWT, borrarProducto);

router.post("/deleteSelected", validarJWT, borrarProductosSeleccionados);

module.exports = router;
