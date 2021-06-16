/*
  Ruta: /api/tpv
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const {
  getVentas,
  getVentaById,
  getProductosMasVendidos,
  getProductosMenosVendidos,
  crearVenta,
  borrarVenta,
  borrarVentasSeleccionadas,
} = require("../../controllers/backoffice/tpv");
const { validarJWT } = require("../../middlewares/validar-jwt");

const router = Router();

router.get("/", validarJWT, getVentas);
router.get("/masVendidos", validarJWT, getProductosMasVendidos);
router.get("/menosVendidos", validarJWT, getProductosMenosVendidos);
router.get("/:uid", validarJWT, getVentaById);

router.post(
  "/",
  [
    check("cliente", "El id del cliente debe de ser válido").isMongoId(),
    check("productos", "Los productos son obligatorios").not().isEmpty(),
    check("formaPago", "La forma de pago es obligatoria").notEmpty(),
    validarCampos,
  ],
  crearVenta
);

router.delete("/:uid", validarJWT, borrarVenta);

router.post("/deleteSelected", validarJWT, borrarVentasSeleccionadas);

module.exports = router;
