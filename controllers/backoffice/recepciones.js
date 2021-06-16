const { response } = require("express");

const RecepcionMercancia = require("../../models/recepcionMercancia");

const getRecepciones = async (req, res = response) => {
  try {
    const [recepciones, total] = await Promise.all([
      RecepcionMercancia.find({}),
      RecepcionMercancia.countDocuments(),
    ]);

    res.json({
      ok: true,
      recepciones,
      total,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "No se han encontrado recepciones de mercancía",
    });
  }
};

const getProductosMasComprados = async (req, res = response) => {
  try {
    const productosRecepciones = await RecepcionMercancia.find(
      {},
      { productos: 1, _id: 0 }
    );
    const allProductos = [];
    const productosMasComprados = [];
    for await (const productosRecepcion of productosRecepciones) {
      for (let i = 0; i < productosRecepcion.get("productos").length; i++) {
        allProductos.push({
          nombre: productosRecepcion.get("productos")[i].nombre,
          cantidad: productosRecepcion.get("productos")[i].cantidad,
        });
      }
    }
    allProductos.sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

    for (let i = 0; i < allProductos.length; i++) {
      if (allProductos[i + 1]?.nombre === allProductos[i].nombre) {
        allProductos[i].cantidad += allProductos[i + 1].cantidad;
        productosMasComprados.push(allProductos[i]);
        allProductos.splice(i + 1, 1);
      } else {
        productosMasComprados.push(allProductos[i]);
      }
    }

    productosMasComprados.sort((a, b) => (a.cantidad < b.cantidad ? 1 : -1));

    if (productosMasComprados.length > 3) productosMasComprados.length = 3;

    res.json({
      ok: true,
      productosMasComprados,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "No se han encontrado productos más comprados",
    });
  }
};

const getProductosMenosComprados = async (req, res = response) => {
  try {
    const productosRecepciones = await RecepcionMercancia.find(
      {},
      { productos: 1, _id: 0 }
    );
    const allProductos = [];
    const productosMenosComprados = [];
    for await (const productosRecepcion of productosRecepciones) {
      for (let i = 0; i < productosRecepcion.get("productos").length; i++) {
        allProductos.push({
          nombre: productosRecepcion.get("productos")[i].nombre,
          cantidad: productosRecepcion.get("productos")[i].cantidad,
        });
      }
    }
    allProductos.sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

    for (let i = 0; i < allProductos.length; i++) {
      if (allProductos[i + 1]?.nombre === allProductos[i].nombre) {
        allProductos[i].cantidad += allProductos[i + 1].cantidad;
        productosMenosComprados.push(allProductos[i]);
        allProductos.splice(i + 1, 1);
      } else {
        productosMenosComprados.push(allProductos[i]);
      }
    }

    productosMenosComprados.sort((a, b) => (a.cantidad > b.cantidad ? 1 : -1));

    if (productosMenosComprados.length > 3) productosMenosComprados.length = 3;

    res.json({
      ok: true,
      productosMenosComprados,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "No se han encontrado productos menos comprados",
    });
  }
};

const getRecepcionById = async (req, res = response) => {
  const id = req.params.uid;
  try {
    const recepcion = await RecepcionMercancia.findById(id);
    res.json({
      ok: true,
      recepcion,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "Recepción de mercancía no encontrada",
    });
  }
};

const crearRecepcion = async (req, res = response) => {
  const recepcion = new RecepcionMercancia({
    ...req.body,
  });

  try {
    const recepcionDB = await recepcion.save();

    res.json({
      ok: true,
      recepcion: recepcionDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al crear la recepción de mercancía",
    });
  }
};

const actualizarRecepcion = async (req, res = response) => {
  const id = req.params.uid;

  try {
    const recepcion = await RecepcionMercancia.findById(id);

    if (!recepcion) {
      return res.status(404).json({
        ok: true,
        msg: "Recepción de mercancía no encontrada por id",
      });
    }

    const cambiosRecepcion = {
      ...req.body,
    };

    const recepcionActualizada = await RecepcionMercancia.findByIdAndUpdate(
      id,
      cambiosRecepcion,
      { new: true }
    );

    res.json({
      ok: true,
      recepcion: recepcionActualizada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar la recepción de mercancía",
    });
  }
};

const borrarRecepcion = async (req, res = response) => {
  const id = req.params.uid;

  try {
    const recepcion = await RecepcionMercancia.findById(id);

    if (!recepcion) {
      return res.status(404).json({
        ok: true,
        msg: "Recepción de mercancía no encontrada por id",
      });
    }

    await RecepcionMercancia.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Recepción de mercancía borrada",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al borrar la recepción de mercancía",
    });
  }
};

const borrarRecepcionesSeleccionados = async (req, res = response) => {
  try {
    // sacamos un array con solo los ids de las recepciones a borrar
    let recepcionesBorrar = req.body.map((recepcion) => {
      return recepcion.uid;
    });

    // filtramos borrados por id, que comprueba en el array de las recepciones a borrar
    await RecepcionMercancia.deleteMany({
      _id: { $in: recepcionesBorrar },
    });

    res.json({
      ok: true,
      msg: "Recepciones de mercancía borradas",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al borrar las recepciones de mercancía",
    });
  }
};

module.exports = {
  getRecepciones,
  getRecepcionById,
  getProductosMasComprados,
  getProductosMenosComprados,
  crearRecepcion,
  actualizarRecepcion,
  borrarRecepcion,
  borrarRecepcionesSeleccionados,
};
