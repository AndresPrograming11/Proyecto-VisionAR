export const registrarUsuario = async (nombre, correo, usuario, contraseña) => {
  try {
    const response = await fetch("http://localhost/carrito-backend/registro.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombre,
        correo: correo,
        username: usuario,
        password: contraseña,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al registrar:", error);
    return { success: false, message: "Error de conexión con el servidor" };
  }
};