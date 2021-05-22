const { response } = require("express");

const Categoria = require("../../models/categoria");

const getCategorias = async (req, res = response) => {
  try {
    const [categorias, total] = await Promise.all([
      Categoria.find({}),
      Categoria.countDocuments(),
    ]);

    res.json({
      ok: true,
      categorias,
      total,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "No se han encontrado categorías",
    });
  }
};
const getCategoriaById = async (req, res = response) => {
  const id = req.params.uid;
  try {
    const categoria = await Categoria.findById(id);
    res.json({
      ok: true,
      categoria,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "Categoría no encontrada",
    });
  }
};

const crearCategoria = async (req, res = response) => {
  const categoria = new Categoria({
    ...req.body,
  });

  try {
    const categoriaDB = await categoria.save();

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al crear la categoría",
    });
  }
};

const actualizarCategoria = async (req, res = response) => {
  const id = req.params.uid;

  try {
    const categoria = await Categoria.findById(id);

    if (!categoria) {
      return res.status(404).json({
        ok: true,
        msg: "Categoría no encontrada por id",
      });
    }

    const cambiosCategoria = {
      ...req.body,
    };

    const categoriaActualizada = await Categoria.findByIdAndUpdate(
      id,
      cambiosCategoria,
      { new: true }
    );

    res.json({
      ok: true,
      categoria: categoriaActualizada,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Error al actualizar la categoría",
    });
  }
};

const borrarCategoria = async (req, res = response) => {
  const id = req.params.uid;

  try {
    const categoria = await Categoria.findById(id);

    if (!categoria) {
      return res.status(404).json({
        ok: true,
        msg: "Categoría no encontrada por id",
      });
    }

    await Categoria.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Categoría borrada",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al borrar la categoría",
    });
  }
};

const borrarCategoriasSeleccionadas = async (req, res = response) => {
  try {
    // sacamos un array con solo los ids de los categorias a borrar
    let categoriasBorrar = req.body.map((categoria) => {
      return categoria.uid;
    });

    // filtramos el borrados por id, que comprueba en el array de categorias a borrar
    await Categoria.deleteMany({
      _id: { $in: categoriasBorrar },
    });

    res.json({
      ok: true,
      msg: "Categorias eliminadas",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al borrar las categorías",
    });
  }
};

module.exports = {
  getCategorias,
  getCategoriaById,
  crearCategoria,
  actualizarCategoria,
  borrarCategoria,
  borrarCategoriasSeleccionadas,
};
