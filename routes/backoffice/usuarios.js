/*
    Ruta: /api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');

const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario, borrarUsuariosSeleccionados } = require('../../controllers/backoffice/usuarios');
const { validarJWT, validarMismoUsuario } = require('../../middlewares/validar-jwt');


const router = Router();


router.get('/', validarJWT, getUsuarios);

router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        check('nick', 'El nick es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    crearUsuario
);

router.put('/:uid',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('nick', 'El nick es obligatorio').not().isEmpty(),
        check('role', 'El role es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    actualizarUsuario
);

router.delete('/:uid',
    validarJWT,
    borrarUsuario,
    validarMismoUsuario
);

router.post('/deleteSelected',
    validarJWT,
    borrarUsuariosSeleccionados,
    validarMismoUsuario
)



module.exports = router;