/*
  Ruta: /api/envios
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const {
  getEnvios,
  getEnvioById,
  getProductosMasVendidosEnEnvios,
  getProductosMenosVendidosEnEnvios,
  crearEnvio,
  actualizarEnvio,
  borrarEnvio,
  borrarEnviosSeleccionados,
} = require("../../controllers/backoffice/envios");
const { validarJWT } = require("../../middlewares/validar-jwt");

const router = Router();

router.get("/", validarJWT, getEnvios);
router.get("/masVendidosEnvios", validarJWT, getProductosMasVendidosEnEnvios);
router.get(
  "/menosVendidosEnvios",
  validarJWT,
  getProductosMenosVendidosEnEnvios
);

router.get("/:uid", validarJWT, getEnvioById);

router.post(
  "/",
  [
    check("numEnvio", "El nombre es obligatorio").not().isEmpty(),
    check("fechaEnvio", "La fecha de envío es obligatoria").not().isEmpty(),
    check("cliente", "El id del cliente debe de ser válido").isMongoId(),
    check("productos", "Los productos son obligatorios").not().isEmpty(),
    validarCampos,
  ],
  crearEnvio
);

router.put(
  "/:uid",
  [
    validarJWT,
    check("numEnvio", "El nombre es obligatorio").not().isEmpty(),
    check("fechaEnvio", "La fecha de envío es obligatoria").not().isEmpty(),
    check("cliente", "El id del cliente debe de ser válido").isMongoId(),
    check("productos", "Los productos son obligatorios").not().isEmpty(),
    validarCampos,
  ],
  actualizarEnvio
);

router.delete("/:uid", validarJWT, borrarEnvio);

router.post("/deleteSelected", validarJWT, borrarEnviosSeleccionados);

module.exports = router;
