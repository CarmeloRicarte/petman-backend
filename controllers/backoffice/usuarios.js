const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../../models/usuario');
const { generarJWT } = require('../../helpers/jwt');


const getUsuarios = async (req, res) => {

    const [usuarios, total] = await Promise.all([
        Usuario
            .find({}, 'nombre nick role img'),
        Usuario.countDocuments()
    ]);


    res.json({
        ok: true,
        usuarios,
        total
    });

}

const crearUsuario = async (req, res = response) => {

    const { nick, password } = req.body;

    try {

        const existeNick = await Usuario.findOne({ nick });

        if (existeNick) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        // Guardar usuario
        await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuario.id);


        res.json({
            ok: true,
            usuario,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }


}


const actualizarUsuario = async (req, res = response) => {

    const uid = req.params.uid;


    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones
        const { nombre, nick, ...campos } = req.body;

        if (usuarioDB.nick !== nick) {

            const existeNick = await Usuario.findOne({ nick });
            if (existeNick) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese nick'
                });
            }
        }
        campos.nick = nick;


        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}


const borrarUsuario = async (req, res = response) => {

    const uid = req.params.uid;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);


        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }
}

const borrarUsuariosSeleccionados = async (req, res = response) => {
    try {
        // sacamos un array con solo los ids de los usuarios a borrar
        let usuariosBorrar = req.body.map((usuario) => {
            return usuario.uid;
        });

        // filtramos el borrados por id, que comprueba en el array de usuarios a borrar
        await Usuario.deleteMany(
            {
                _id: { $in: usuariosBorrar }
            }
        )

        res.json({
            ok: true,
            msg: 'Usuarios eliminados'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al borrar los usuarios'
        });
    }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
    borrarUsuariosSeleccionados
}