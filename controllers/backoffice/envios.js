const { response } = require("express");
const envioMercancia = require("../../models/envioMercancia");

const getEnvios = async (req, res = response) => {
  try {
    const [envios, total] = await Promise.all([
      envioMercancia.find({}),
      envioMercancia.countDocuments(),
    ]);

    res.json({
      ok: true,
      envios,
      total,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "No se han encontrado envíos de mercancía",
    });
  }
};

const getProductosMasVendidosEnEnvios = async (req, res = response) => {
  try {
    const productosVentasEnvios = await envioMercancia.find(
      {},
      { productos: 1, _id: 0 }
    );
    const allProductos = [];
    const productosMasVendidosEnvios = [];
    for await (const productosEnvio of productosVentasEnvios) {
      for (let i = 0; i < productosEnvio.get("productos").length; i++) {
        allProductos.push({
          nombre: productosEnvio.get("productos")[i].nombre,
          cantidad: productosEnvio.get("productos")[i].cantidad,
        });
      }
    }
    allProductos.sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

    for (let i = 0; i < allProductos.length; i++) {
      if (allProductos[i + 1]?.nombre === allProductos[i].nombre) {
        allProductos[i].cantidad += allProductos[i + 1].cantidad;
        productosMasVendidosEnvios.push(allProductos[i]);
        allProductos.splice(i + 1, 1);
      } else {
        productosMasVendidosEnvios.push(allProductos[i]);
      }
    }

    productosMasVendidosEnvios.sort((a, b) =>
      a.cantidad < b.cantidad ? 1 : -1
    );

    if (productosMasVendidosEnvios.length > 3)
      productosMasVendidosEnvios.length = 3;

    res.json({
      ok: true,
      productosMasVendidosEnvios,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "No se han encontrado productos más vendidos en envíos",
    });
  }
};

const getProductosMenosVendidosEnEnvios = async (req, res = response) => {
  try {
    const productosVentasEnvios = await envioMercancia.find(
      {},
      { productos: 1, _id: 0 }
    );
    const allProductos = [];
    const productosMenosVendidosEnvios = [];
    for await (const productosEnvio of productosVentasEnvios) {
      for (let i = 0; i < productosEnvio.get("productos").length; i++) {
        allProductos.push({
          nombre: productosEnvio.get("productos")[i].nombre,
          cantidad: productosEnvio.get("productos")[i].cantidad,
        });
      }
    }
    allProductos.sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

    for (let i = 0; i < allProductos.length; i++) {
      if (allProductos[i + 1]?.nombre === allProductos[i].nombre) {
        allProductos[i].cantidad += allProductos[i + 1].cantidad;
        productosMenosVendidosEnvios.push(allProductos[i]);
        allProductos.splice(i + 1, 1);
      } else {
        productosMenosVendidosEnvios.push(allProductos[i]);
      }
    }

    productosMenosVendidosEnvios.sort((a, b) =>
      a.cantidad > b.cantidad ? 1 : -1
    );

    if (productosMenosVendidosEnvios.length > 3)
      productosMenosVendidosEnvios.length = 3;

    res.json({
      ok: true,
      productosMenosVendidosEnvios,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "No se han encontrado productos menos vendidos en envíos",
    });
  }
};

const getEnvioById = async (req, res = response) => {
  const id = req.params.uid;
  try {
    const envio = await envioMercancia.findById(id);
    res.json({
      ok: true,
      envio,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "Envío de mercancía no encontrado",
    });
  }
};

const crearEnvio = async (req, res = response) => {
  const envio = new envioMercancia({
    ...req.body,
  });

  try {
    const envioDB = await envio.save();

    res.json({
      ok: true,
      envio: envioDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al crear el envío de mercancía",
    });
  }
};

const actualizarEnvio = async (req, res = response) => {
  const id = req.params.uid;

  try {
    const envio = await envioMercancia.findById(id);

    if (!envio) {
      return res.status(404).json({
        ok: true,
        msg: "Envío de mercancía no encontrado por id",
      });
    }

    const cambiosEnvio = {
      ...req.body,
    };

    const envioActualizado = await envioMercancia.findByIdAndUpdate(
      id,
      cambiosEnvio,
      { new: true }
    );

    res.json({
      ok: true,
      envio: envioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar el envío de mercancía",
    });
  }
};

const borrarEnvio = async (req, res = response) => {
  const id = req.params.uid;

  try {
    const envio = await envioMercancia.findById(id);

    if (!envio) {
      return res.status(404).json({
        ok: true,
        msg: "Envío de mercancía no encontrado por id",
      });
    }

    await envioMercancia.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Envío de mercancía borrado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al borrar el envío de mercancía",
    });
  }
};

const borrarEnviosSeleccionados = async (req, res = response) => {
  try {
    // sacamos un array con solo los ids de los envios a borrar
    let enviosBorrar = req.body.map((envio) => {
      return envio.uid;
    });

    // filtramos borrados por id, que comprueba en el array de los envios a borrar
    await envioMercancia.deleteMany({
      _id: { $in: enviosBorrar },
    });

    res.json({
      ok: true,
      msg: "Envios de mercancía borrados",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al borrar los envios de mercancía",
    });
  }
};

module.exports = {
  getEnvios,
  getEnvioById,
  getProductosMasVendidosEnEnvios,
  getProductosMenosVendidosEnEnvios,
  crearEnvio,
  actualizarEnvio,
  borrarEnvio,
  borrarEnviosSeleccionados,
};
