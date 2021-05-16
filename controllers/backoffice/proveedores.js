const { response } = require('express');

const Proveedor = require('../../models/proveedor');

const getProveedores = async (req, res = response) => {
    try {
        const [proveedores, total] = await Promise.all([
            Proveedor.find({}),
            Proveedor.countDocuments()
        ]);

        res.json({
            ok: true,
            proveedores,
            total
        });
    } catch (error) {
        console.error(error);
        res.json({
            ok: false,
            msg: 'No se han encontrado proveedores'
        });
    }

}
const getProveedorById = async (req, res = response) => {
    const id = req.params.uid
    try {
        const proveedor = await Proveedor.findById(id)
        res.json({
            ok: true,
            proveedor
        });
    } catch (error) {
        console.error(error);
        res.json({
            ok: false,
            msg: 'Proveedor no encontrado'
        });
    }

}

const crearProveedor = async (req, res = response) => {

    const proveedor = new Proveedor({
        ...req.body
    });

    try {

        const proveedorDB = await proveedor.save();

        res.json({
            ok: true,
            proveedor: proveedorDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear el proveedor'
        });
    }


}

const actualizarProveedor = async (req, res = response) => {

    const id = req.params.uid;

    try {

        const proveedor = await Proveedor.findById(id);

        if (!proveedor) {
            return res.status(404).json({
                ok: true,
                msg: 'Proveedor no encontrado por id',
            });
        }

        const cambiosProveedor = {
            ...req.body
        }

        const proveedorActualizado = await Proveedor.findByIdAndUpdate(id, cambiosProveedor, { new: true });


        res.json({
            ok: true,
            medico: proveedorActualizado
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el proveedor'
        });
    }

}

const borrarProveedor = async (req, res = response) => {

    const id = req.params.uid;

    try {

        const proveedor = await Proveedor.findById(id);

        if (!proveedor) {
            return res.status(404).json({
                ok: true,
                msg: 'Proveedor no encontrado por id',
            });
        }

        await Proveedor.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Proveedor borrado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al borrar el proveedor'
        })
    }
}

const borrarProveedoresSeleccionados = async (req, res = response) => {
    try {
        // sacamos un array con solo los ids de los proveedores a borrar
        let proveedoresBorrar = req.body.map((proveedor) => {
            return proveedor.uid;
        });

        // filtramos el borrados por id, que comprueba en el array de proveedores a borrar
        await Proveedor.deleteMany(
            {
                _id: { $in: proveedoresBorrar }
            }
        )

        res.json({
            ok: true,
            msg: 'Proveedores eliminados'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al borrar los proveedores'
        });
    }
}


module.exports = {
    getProveedores,
    getProveedorById,
    crearProveedor,
    actualizarProveedor,
    borrarProveedor,
    borrarProveedoresSeleccionados
}