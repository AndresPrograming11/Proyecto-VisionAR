export const obtenerUsuarios = async () => {
    try {
      const response = await fetch("http://localhost/carrito-backend/gestionar_usuarios.php");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return [];
    }
  };
  