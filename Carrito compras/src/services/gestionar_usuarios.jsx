// src/services/gestionar_usuarios.jsx

const API_URL = "http://localhost/carrito-backend/gestionar_usuarios.php";

export const obtenerUsuarios = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    return [];
  }
};

export const actualizarUsuario = async (usuario) => {
  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};


export const eliminarUsuario = async (id) => {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id=${id}`,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return { success: false, message: "Error en la solicitud" };
  }
};
