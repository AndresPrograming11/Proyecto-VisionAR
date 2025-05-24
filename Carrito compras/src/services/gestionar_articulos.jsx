export const registrarArticulo = async (nombre, precio, descripcion, categoria, modelo_glb, modelo_usdz, imagen) => {
  try {
    const response = await fetch("http://localhost/carrito-backend/agregar_articulo.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        precio,
        descripcion,
        categoria,
        modelo_glb,
        modelo_usdz,
        imagen
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al guardar artículo:", error);
    return { success: false, message: "Error de conexión con el servidor" };
  }
};
