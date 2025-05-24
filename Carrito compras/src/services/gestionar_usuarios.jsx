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

export const cambiarContrasenaConToken = async (token, nuevaContrasena) => {
  try {
    const response = await fetch(API_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        nuevaContrasena,
      }),
    });

    const text = await response.text(); // Lee la respuesta como texto
    console.log("Respuesta del servidor:", text); // 👈 Para depuración

    let data;
    try {
      data = JSON.parse(text); // Intenta convertir la respuesta a JSON
    } catch (error) {
      console.error("Error al parsear JSON:", error);
      return { success: false, message: `Respuesta inesperada del servidor: ${text}` };
    }

    if (response.ok && data.success) {
      return { success: true, message: data.message || "Contraseña cambiada correctamente." };
    } else {
      return { success: false, message: data.error || `Error del servidor: ${response.status}` };
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return { success: false, message: `Error de red: ${error.message}. Asegúrate de que el servidor esté corriendo.` };
  }
};
