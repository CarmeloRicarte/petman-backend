/*
  Ruta: /api/recepciones
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const {
  getRecepciones,
  getProductosMasComprados,
  getProductosMenosComprados,
  getRecepcionById,
  crearRecepcion,
  actualizarRecepcion,
  borrarRecepcion,
  borrarRecepcionesSeleccionados,
} = require("../../controllers/backoffice/recepciones");
const { validarJWT } = require("../../middlewares/validar-jwt");

const router = Router();

router.get("/", validarJWT, getRecepciones);
router.get("/masComprados", validarJWT, getProductosMasComprados);
router.get("/menosComprados", validarJWT, getProductosMenosComprados);
router.get("/:uid", validarJWT, getRecepcionById);

router.post(
  "/",
  [
    check("numPedido", "El nombre es obligatorio").not().isEmpty(),
    check("fechaRecepcion", "La fecha es obligatoria").not().isEmpty(),
    check("proveedor", "El id del proveedor debe de ser válido").isMongoId(),
    check("productos", "Los productos son obligatorios").not().isEmpty(),
    validarCampos,
  ],
  crearRecepcion
);

router.put(
  "/:uid",
  [
    validarJWT,
    check("numPedido", "El nombre es obligatorio").not().isEmpty(),
    check("fechaRecepcion", "La fecha es obligatoria").not().isEmpty(),
    check("proveedor", "El id del proveedor debe de ser válido").isMongoId(),
    check("productos", "Los productos son obligatorios").not().isEmpty(),
    validarCampos,
  ],
  actualizarRecepcion
);

router.delete("/:uid", validarJWT, borrarRecepcion);

router.post("/deleteSelected", validarJWT, borrarRecepcionesSeleccionados);

module.exports = router;
