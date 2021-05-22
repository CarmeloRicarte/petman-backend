/*
    Ruta: /api/categorias
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const {
  getCategorias,
  getCategoriaById,
  crearCategoria,
  actualizarCategoria,
  borrarCategoria,
  borrarCategoriasSeleccionadas,
} = require("../../controllers/backoffice/categorias");
const { validarJWT } = require("../../middlewares/validar-jwt");

const router = Router();

router.get("/", validarJWT, getCategorias);

router.get("/:uid", validarJWT, getCategoriaById);

router.post(
  "/",
  [check("nombre", "El nombre es obligatorio").not().isEmpty(), validarCampos],
  crearCategoria
);

router.put(
  "/:uid",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarCategoria
);

router.delete("/:uid", validarJWT, borrarCategoria);

router.post("/deleteSelected", validarJWT, borrarCategoriasSeleccionadas);

module.exports = router;
