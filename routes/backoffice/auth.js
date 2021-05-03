/*
    Path: '/api/login'
*/
const { Router } = require('express');
const { login, renewToken } = require('../../controllers/backoffice/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar-campos');
const { validarJWT } = require('../../middlewares/validar-jwt');

const router = Router();


router.post('/',
    [
        check('nick', 'El usuario es obligatorio').notEmpty(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    login
);

router.get('/renew',
    validarJWT,
    renewToken
)

module.exports = router;