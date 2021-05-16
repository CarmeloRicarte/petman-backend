/*
    Ruta: /api/clientes
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { getClientes, getClienteById, crearCliente, actualizarCliente, borrarCliente, borrarClientesSeleccionados } = require('../../controllers/backoffice/clientes');
const { validarJWT } = require('../../middlewares/validar-jwt');


const router = Router();


router.get('/', validarJWT, getClientes);

router.get('/:uid',
    validarJWT,
    getClienteById
);

router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
        check('poblacion', 'La población es obligatoria').not().isEmpty(),
        check('direccion', 'La dirección es obligatoria').not().isEmpty(),
        check('telefono', 'El teléfono es obligatorio').notEmpty(),
        validarCampos,
    ],
    crearCliente
);

router.put('/:uid',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
        check('poblacion', 'La población es obligatoria').not().isEmpty(),
        check('direccion', 'La dirección es obligatoria').not().isEmpty(),
        check('telefono', 'El teléfono es obligatorio').notEmpty(),
        validarCampos,
    ],
    actualizarCliente
);

router.delete('/:uid',
    validarJWT,
    borrarCliente,
);

router.post('/deleteSelected',
    validarJWT,
    borrarClientesSeleccionados
)

module.exports = router;