const { response } = require("express");
const Venta = require("../../models/venta");
const _ = require("lodash");

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

const getProductosMasVendidos = async (req, res = response) => {
  try {
    const productosVentas = await Venta.find({}, { productos: 1, _id: 0 });
    const allProductos = [];
    const productosMasVendidos = [];
    for await (const productosVenta of productosVentas) {
      for (let i = 0; i < productosVenta.get("productos").length; i++) {
        allProductos.push({
          nombre: productosVenta.get("productos")[i].nombre,
          cantidad: productosVenta.get("productos")[i].cantidad,
        });
      }
    }
    allProductos.sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

    for (let i = 0; i < allProductos.length; i++) {
      if (allProductos[i + 1]?.nombre === allProductos[i].nombre) {
        allProductos[i].cantidad += allProductos[i + 1].cantidad;
        productosMasVendidos.push(allProductos[i]);
        allProductos.splice(i + 1, 1);
      } else {
        productosMasVendidos.push(allProductos[i]);
      }
    }

    productosMasVendidos.sort((a, b) => (a.cantidad < b.cantidad ? 1 : -1));

    if (productosMasVendidos.length > 3) productosMasVendidos.length = 3;

    res.json({
      ok: true,
      productosMasVendidos,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "No se han encontrado productos más vendidos",
    });
  }
};

const getProductosMenosVendidos = async (req, res = response) => {
  try {
    const productosVentas = await Venta.find({}, { productos: 1, _id: 0 });
    const allProductos = [];
    const productosMenosVendidos = [];

    // obtenemos todos los productos vendidos
    for await (const productosVenta of productosVentas) {
      for (let i = 0; i < productosVenta.get("productos").length; i++) {
        allProductos.push({
          nombre: productosVenta.get("productos")[i].nombre,
          cantidad: productosVenta.get("productos")[i].cantidad,
        });
      }
    }

    // los ordenamos por nombre
    allProductos.sort((a, b) => (a.nombre > b.nombre ? 1 : -1));

    // quitamos duplicados y sumamos cantidad
    for (let i = 0; i < allProductos.length; i++) {
      if (allProductos[i + 1]?.nombre === allProductos[i].nombre) {
        allProductos[i].cantidad += allProductos[i + 1].cantidad;
        productosMenosVendidos.push(allProductos[i]);
        allProductos.splice(i + 1, 1);
      } else {
        productosMenosVendidos.push(allProductos[i]);
      }
    }

    // ordenamos por cantidad ascendente
    productosMenosVendidos.sort((a, b) => (a.cantidad > b.cantidad ? 1 : -1));

    if (productosMenosVendidos.length > 3) productosMenosVendidos.length = 3;

    res.json({
      ok: true,
      productosMenosVendidos,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "No se han encontrado productos menos vendidos",
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
  getProductosMasVendidos,
  getProductosMenosVendidos,
  crearVenta,
  borrarVenta,
  borrarVentasSeleccionadas,
};
