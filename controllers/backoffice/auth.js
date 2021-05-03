const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../../models/usuario');
const { generarJWT } = require('../../helpers/jwt');
// const { getMenuFrontend } = require('../../helpers/menu-frontend');


const login = async (req, res = response) => {

    const { nick, password } = req.body;

    try {

        // Verificar email
        const usuario = await Usuario.findOne({ nick });

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            token,
            usuario
            // menu: getMenuFrontend(usuario.role)
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    // Generar el TOKEN - JWT
    const token = await generarJWT(uid);

    //Obtener el usuario por uid
    const usuario = await Usuario.findById(uid);
    if (!usuario) {
        return res.status(404).json({
            ok: false,
            msg: 'No se ha encontrado ningún usuario con ese id'
        });
    }

    res.json({
        ok: true,
        token,
        usuario,
        // menu: getMenuFrontend(usuario.role)
    });
};

module.exports = {
    login,
    renewToken
}
