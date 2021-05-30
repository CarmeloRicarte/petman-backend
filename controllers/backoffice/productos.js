const { response } = require("express");

const Producto = require("../../models/producto");

const getProductos = async (req, res = response) => {
  try {
    const [productos, total] = await Promise.all([
      Producto.find({}),
      Producto.countDocuments(),
    ]);

    res.json({
      ok: true,
      productos,
      total,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "No se han encontrado productos",
    });
  }
};
const getProductoById = async (req, res = response) => {
  const id = req.params.uid;
  try {
    const producto = await Producto.findById(id);
    res.json({
      ok: true,
      producto,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "Producto no encontrado",
    });
  }
};

const crearProducto = async (req, res = response) => {
  const producto = new Producto({
    ...req.body,
  });

  try {
    const productoDB = await producto.save();

    res.json({
      ok: true,
      producto: productoDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al crear el producto",
    });
  }
};

const actualizarProducto = async (req, res = response) => {
  const id = req.params.uid;

  try {
    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({
        ok: true,
        msg: "Producto no encontrado por id",
      });
    }

    const cambiosProducto = {
      ...req.body,
    };

    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      cambiosProducto,
      { new: true }
    );

    res.json({
      ok: true,
      producto: productoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar el producto",
    });
  }
};

const actualizarCantidadProducto = async (req, res = response) => {
  try {
    const productoActualizar = req.body;
    const id = req.params.uid;
    const from = req.params.from;
    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({
        ok: true,
        msg: "Producto no encontrado por id",
      });
    }

    const productoCantidadActualizar = parseInt(productoActualizar.cantidad);
    let cantidadProductoActualizado;
    if (from === "envios") {
      if (producto.get("cantidad") !== 0) {
        cantidadProductoActualizado = await Producto.findByIdAndUpdate(
          id,
          {
            cantidad: producto.get("cantidad") - productoCantidadActualizar,
          },
          { new: true }
        );
      } else {
        cantidadProductoActualizado = await Producto.findByIdAndUpdate(
          id,
          {
            cantidad: 0,
          },
          { new: true }
        );
      }
    } else {
      cantidadProductoActualizado = await Producto.findByIdAndUpdate(
        id,
        {
          cantidad: producto.get("cantidad") + productoCantidadActualizar,
        },
        { new: true }
      );
    }

    res.json({
      ok: true,
      cantidadProductoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar la cantidad del producto",
    });
  }
};

const actualizarPrecioProducto = async (req, res = response) => {
  try {
    const productoActualizar = req.body;
    const id = req.params.uid;
    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({
        ok: true,
        msg: "Producto no encontrado por id",
      });
    }

    const productoPrecioActualizar = parseInt(productoActualizar.precio);

    const productoPrecioActualizado = await Producto.findByIdAndUpdate(
      id,
      {
        precio: productoPrecioActualizar,
      },
      { new: true }
    );

    res.json({
      ok: true,
      productoPrecioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar el precio del producto",
    });
  }
};

const borrarProducto = async (req, res = response) => {
  const id = req.params.uid;

  try {
    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({
        ok: true,
        msg: "Producto no encontrado por id",
      });
    }

    await Producto.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Producto borrado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al borrar el producto",
    });
  }
};

const borrarProductosSeleccionados = async (req, res = response) => {
  try {
    // sacamos un array con solo los ids de los productos a borrar
    let productosBorrar = req.body.map((producto) => {
      return producto.uid;
    });

    // filtramos el borrados por id, que comprueba en el array de productos a borrar
    await Producto.deleteMany({
      _id: { $in: productosBorrar },
    });

    res.json({
      ok: true,
      msg: "Productos eliminados",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al borrar los productos",
    });
  }
};

module.exports = {
  getProductos,
  getProductoById,
  crearProducto,
  actualizarProducto,
  actualizarCantidadProducto,
  actualizarPrecioProducto,
  borrarProducto,
  borrarProductosSeleccionados,
};
