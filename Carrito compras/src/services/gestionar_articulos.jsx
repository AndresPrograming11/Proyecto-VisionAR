const BASE_URL = "http://localhost/carrito-backend/controller/articuloscontroller.php";

export const obtenerArticulos = async () => {
  try {
    const res = await fetch(BASE_URL);
    return await res.json();
  } catch {
    return [];
  }
};

export const registrarArticulo = async (nombre, precio, descripcion, categoria, modeloGLB, modeloUSDZ, imagen) => {
  try {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("precio", precio);
    formData.append("descripcion", descripcion);
    formData.append("categoria", categoria);
    if (imagen) formData.append("imagen", imagen);
    if (modeloGLB) formData.append("modeloGLB", modeloGLB);
    if (modeloUSDZ) formData.append("modeloUSDZ", modeloUSDZ);

    const response = await fetch(BASE_URL, {
      method: "POST",
      body: formData,
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const actualizarArticulo = async (formData) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST", // usar POST para actualizar también
      body: formData,
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};


export const eliminarArticuloPorId = async (id) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id=${id}`,
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};
