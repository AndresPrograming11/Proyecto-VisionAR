export const loginUsuario = async (usuario, contraseña) => {
  try {
    const response = await fetch("http://localhost/carrito-backend/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: usuario, password: contraseña }),
    });

    const data = await response.json();
    return data;  // Se regresa toda la respuesta, incluyendo el rol
  } catch (error) {
    console.error("Error en login:", error);
    return { success: false, message: "Error de red o servidor" };
  }
};
