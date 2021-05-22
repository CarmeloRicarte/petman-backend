/*
  Ruta: /api/subcategorias
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const {
  getSubcategorias,
  getSubcategoriaById,
  crearSubcategoria,
  actualizarSubcategoria,
  borrarSubcategoria,
  borrarSubcategoriasSeleccionadas,
} = require("../../controllers/backoffice/subcategorias");
const { validarJWT } = require("../../middlewares/validar-jwt");

const router = Router();

router.get("/", validarJWT, getSubcategorias);

router.get("/:uid", validarJWT, getSubcategoriaById);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "El id de la categoría debe de ser válido").isMongoId(),
    validarCampos,
  ],
  crearSubcategoria
);

router.put(
  "/:uid",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "El id de la categoría debe de ser válido").isMongoId(),
    validarCampos,
  ],
  actualizarSubcategoria
);

router.delete("/:uid", validarJWT, borrarSubcategoria);

router.post("/deleteSelected", validarJWT, borrarSubcategoriasSeleccionadas);

module.exports = router;
