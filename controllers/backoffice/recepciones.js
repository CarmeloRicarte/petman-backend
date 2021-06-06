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
  // const productos = req.body.productos;

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

    // actualizarProductos(productos);

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
  crearRecepcion,
  actualizarRecepcion,
  borrarRecepcion,
  borrarRecepcionesSeleccionados,
};
