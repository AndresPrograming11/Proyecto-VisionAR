export const crearArticulo = async (formData) => {
    try {
      const response = await fetch("http://localhost/carrito-backend/crear_articulo.php", {
        method: "POST",
        body: formData, // importante: enviar FormData, no JSON
      });
      return await response.json();
    } catch (error) {
      console.error("Error al crear artículo:", error);
      return { success: false, message: "Error de conexión" };
    }
  };
  
  export const obtenerArticulos = async () => {
    try {
      const response = await fetch("http://localhost/carrito-backend/listar_articulos.php");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Datos inválidos recibidos del servidor");
      }
      return data;
    } catch (error) {
      console.error("Error al obtener artículos:", error);
      return [];
    }
  };
  