const { response } = require("express");

const Subcategoria = require("../../models/subcategoria");

const getSubcategorias = async (req, res = response) => {
  try {
    const [subcategorias, total] = await Promise.all([
      Subcategoria.find({}),
      Subcategoria.countDocuments(),
    ]);

    res.json({
      ok: true,
      subcategorias,
      total,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "No se han encontrado subcategorías",
    });
  }
};
const getSubcategoriaById = async (req, res = response) => {
  const id = req.params.uid;
  try {
    const subcategoria = await Subcategoria.findById(id);
    res.json({
      ok: true,
      subcategoria,
    });
  } catch (error) {
    console.error(error);
    res.json({
      ok: false,
      msg: "Subcategoría no encontrada",
    });
  }
};

const crearSubcategoria = async (req, res = response) => {
  const subcategoria = new Subcategoria({
    ...req.body,
  });

  try {
    const subcategoriaDB = await subcategoria.save();

    res.json({
      ok: true,
      subcategoria: subcategoriaDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al crear la subcategoría",
    });
  }
};

const actualizarSubcategoria = async (req, res = response) => {
  const id = req.params.uid;

  try {
    const subcategoria = await Subcategoria.findById(id);

    if (!subcategoria) {
      return res.status(404).json({
        ok: true,
        msg: "Subcategoría no encontrada por id",
      });
    }

    const cambiosSubcategoria = {
      ...req.body,
    };

    const subcategoriaActualizada = await Subcategoria.findByIdAndUpdate(
      id,
      cambiosSubcategoria,
      { new: true }
    );

    res.json({
      ok: true,
      subcategoria: subcategoriaActualizada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar la subcategoría",
    });
  }
};

const borrarSubcategoria = async (req, res = response) => {
  const id = req.params.uid;

  try {
    const subcategoria = await Subcategoria.findById(id);

    if (!subcategoria) {
      return res.status(404).json({
        ok: true,
        msg: "Subcategoría no encontrada por id",
      });
    }

    await Subcategoria.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Subcategoría borrada",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al borrar la subcategoría",
    });
  }
};

const borrarSubcategoriasSeleccionadas = async (req, res = response) => {
  try {
    // sacamos un array con solo los ids de los subcategorias a borrar
    let subcategoriasBorrar = req.body.map((subcategoria) => {
      return subcategoria.uid;
    });

    // filtramos el borrados por id, que comprueba en el array de subcategorias a borrar
    await Subcategoria.deleteMany({
      _id: { $in: subcategoriasBorrar },
    });

    res.json({
      ok: true,
      msg: "Subcategorías eliminadas",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al borrar las subcategorías",
    });
  }
};

module.exports = {
  getSubcategorias,
  getSubcategoriaById,
  crearSubcategoria,
  actualizarSubcategoria,
  borrarSubcategoria,
  borrarSubcategoriasSeleccionadas,
};
