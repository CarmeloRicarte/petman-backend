const { response } = require('express');

const Cliente = require('../../models/cliente');

const getClientes = async (req, res = response) => {
    try {
        const [clientes, total] = await Promise.all([
            Cliente.find({}),
            Cliente.countDocuments()
        ]);

        res.json({
            ok: true,
            clientes,
            total
        });
    } catch (error) {
        console.error(error);
        res.json({
            ok: false,
            msg: 'No se han encontrado clientes'
        });
    }

}
const getClienteById = async (req, res = response) => {
    const id = req.params.uid
    try {
        const cliente = await Cliente.findById(id)
        res.json({
            ok: true,
            cliente
        });
    } catch (error) {
        console.error(error);
        res.json({
            ok: false,
            msg: 'Cliente no encontrado'
        });
    }

}

const crearCliente = async (req, res = response) => {

    const cliente = new Cliente({
        ...req.body
    });

    try {

        const clienteDB = await cliente.save();

        res.json({
            ok: true,
            cliente: clienteDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear el cliente'
        });
    }


}

const actualizarCliente = async (req, res = response) => {

    const id = req.params.uid;

    try {

        const cliente = await Cliente.findById(id);

        if (!cliente) {
            return res.status(404).json({
                ok: true,
                msg: 'Cliente no encontrado por id',
            });
        }

        const cambiosCliente = {
            ...req.body
        }

        const clienteActualizado = await Cliente.findByIdAndUpdate(id, cambiosCliente, { new: true });


        res.json({
            ok: true,
            medico: clienteActualizado
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el cliente'
        });
    }

}

const borrarCliente = async (req, res = response) => {

    const id = req.params.uid;

    try {

        const cliente = await Cliente.findById(id);

        if (!cliente) {
            return res.status(404).json({
                ok: true,
                msg: 'Cliente no encontrado por id',
            });
        }

        await Cliente.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Cliente borrado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al borrar el cliente'
        })
    }
}

const borrarClientesSeleccionados = async (req, res = response) => {
    try {
        // sacamos un array con solo los ids de los clientes a borrar
        let clientesBorrar = req.body.map((cliente) => {
            return cliente.uid;
        });

        // filtramos el borrados por id, que comprueba en el array de clientes a borrar
        await Cliente.deleteMany(
            {
                _id: { $in: clientesBorrar }
            }
        )

        res.json({
            ok: true,
            msg: 'Clientes eliminados'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al borrar los clientes'
        });
    }
}


module.exports = {
    getClientes,
    getClienteById,
    crearCliente,
    actualizarCliente,
    borrarCliente,
    borrarClientesSeleccionados
}