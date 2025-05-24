// facturaService.js

export const crearFactura = async (factura) => {
  try {
    const response = await fetch("http://localhost/carrito-backend/facturaController.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(factura),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear la factura:", error);
    return { success: false, message: "Error al conectar con el servidor." };
  }
};
