import { useEffect, useState } from "react";
import "../style/AdminArticulos.css";
import { obtenerArticulos } from "../services/articulos";

// Función para validar si es una imagen
const esImagen = (url) => {
  const formatosImagen = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const extension = url.split('.').pop().toLowerCase();
  return formatosImagen.includes(extension);
};

// Función para validar si es un enlace
const esEnlace = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

function AdminArticulos() {
  const [articulos, setArticulos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerArticulos();
        if (data && Array.isArray(data)) {
          setArticulos(data);
        } else {
          console.error("Datos inválidos:", data);
        }
      } catch (error) {
        console.error("Error al obtener artículos:", error);
      }
    };
    fetchData();
  }, []);

  const eliminarArticulo = (id) => {
    alert("Implementa eliminación si deseas.");
  };

  const editarArticulo = (id) => {
    alert("Implementa edición si deseas.");
  };

  return (
    <div className="admin-articulos">
      <h2>Gestión de Artículos</h2>
      <table className="articulos-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Imagen/Enlace</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Modelos 3D</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((art) => (
            <tr key={art.id}>
              <td>{art.nombre}</td>
              <td>
                {esImagen(art.imagen) ? (
                  <img 
                    src={esEnlace(art.imagen) ? art.imagen : `http://localhost/carrito-backend/${art.imagen}`} 
                    alt={art.nombre} 
                    className="img-preview"
                    width="150" 
                    height="150"
                    onError={(e) => e.target.src = "/ruta-a-imagen-alternativa.jpg"}
                  />
                ) : esEnlace(art.imagen) ? (
                  <a href={art.imagen} target="_blank" rel="noopener noreferrer">{art.imagen}</a>
                ) : (
                  <span>Formato no soportado</span>
                )}
              </td>
              <td>{art.descripcion}</td>
              <td>${parseFloat(art.precio).toLocaleString()}</td>
              <td>
                {art.modelo_3D_GLB && <a href={art.modelo_3D_GLB} target="_blank">GLB</a>}
                {" / "}
                {art.modelo_3D_USDZ && <a href={art.modelo_3D_USDZ} target="_blank">USDZ</a>}
              </td>
              <td>{art.categoria}</td>
              <td>
                <button onClick={() => editarArticulo(art.id)} className="btn-editar">Editar</button>
                <button onClick={() => eliminarArticulo(art.id)} className="btn-eliminar">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminArticulos;
