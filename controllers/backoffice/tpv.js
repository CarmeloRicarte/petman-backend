const { response } = require("express");
const Venta = require("../../models/venta");

const getVentas = async (req, res = response) => {
  try {
    const [ventas, total] = await Promise.all([
      Venta.find({}),
      Venta.countDocuments(),
    ]);

    res.json({
      ok: true,
      ventas,
      total,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "No se han encontrado ventas",
    });
  }
};
const getVentaById = async (req, res = response) => {
  const id = req.params.uid;
  try {
    const venta = await Venta.findById(id);
    res.json({
      ok: true,
      venta,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "Venta no encontrada",
    });
  }
};

const crearVenta = async (req, res = response) => {
  const venta = new Venta({
    ...req.body,
  });

  try {
    const ventaDB = await venta.save();

    res.json({
      ok: true,
      venta: ventaDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al crear la venta",
    });
  }
};

const borrarVenta = async (req, res = response) => {
  const id = req.params.uid;

  try {
    const venta = await Venta.findById(id);

    if (!venta) {
      return res.status(404).json({
        ok: true,
        msg: "Venta no encontrada por id",
      });
    }

    await Venta.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Venta borrada",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al borrar la venta",
    });
  }
};

const borrarVentasSeleccionadas = async (req, res = response) => {
  try {
    // sacamos un array con solo los ids de las ventas a borrar
    let ventasBorrar = req.body.map((venta) => {
      return venta.uid;
    });

    // filtramos borrados por id, que comprueba en el array de las ventas a borrar
    await Venta.deleteMany({
      _id: { $in: ventasBorrar },
    });

    res.json({
      ok: true,
      msg: "Ventas borradas",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al borrar las ventas",
    });
  }
};

module.exports = {
  getVentas,
  getVentaById,
  crearVenta,
  borrarVenta,
  borrarVentasSeleccionadas,
};
