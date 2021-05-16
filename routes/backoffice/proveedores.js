/*
    Ruta: /api/proveedores
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { getProveedores, getProveedorById, crearProveedor, actualizarProveedor, borrarProveedor, borrarProveedoresSeleccionados } = require('../../controllers/backoffice/proveedores');
const { validarJWT } = require('../../middlewares/validar-jwt');


const router = Router();


router.get('/', validarJWT, getProveedores);

router.get('/:uid',
    validarJWT,
    getProveedorById
);

router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('categoria', 'La categoría es obligatoria').not().isEmpty(),
        check('poblacion', 'La población es obligatoria').not().isEmpty(),
        check('direccion', 'La dirección es obligatoria').not().isEmpty(),
        check('telefono', 'El teléfono es obligatorio').notEmpty(),
        check('cif', 'El CIF es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    crearProveedor
);

router.put('/:uid',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('categoria', 'La categoría es obligatoria').not().isEmpty(),
        check('poblacion', 'La población es obligatoria').not().isEmpty(),
        check('direccion', 'La dirección es obligatoria').not().isEmpty(),
        check('telefono', 'El teléfono es obligatorio').notEmpty(),
        check('cif', 'El CIF es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    actualizarProveedor
);

router.delete('/:uid',
    validarJWT,
    borrarProveedor,
);

router.post('/deleteSelected',
    validarJWT,
    borrarProveedoresSeleccionados
)

module.exports = router;