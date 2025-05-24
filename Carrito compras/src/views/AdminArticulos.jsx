import { useState } from "react";
import "../style/AdminArticulos.css";

function AdminArticulos() {
  const [articulos, setArticulos] = useState([
    {
      id: 1,
      nombre: "Camisa Polo",
      imagen: "https://http2.mlstatic.com/D_NQ_NP_696638-MCO75131653897_032024-O.webp",
      descripcion: "Camisa polo de algodón",
      precio: "$25.000",
      modelo3D: "modelo-camisa.glb",
      categoria: "Camisas"
    },
    {
      id: 2,
      nombre: "Sudadera Negra",
      imagen: "https://http2.mlstatic.com/D_NQ_NP_696638-MCO75131653897_032024-O.webp",
      descripcion: "Sudadera cómoda para clima frío",
      precio: "$40.000",
      modelo3D: "modelo-sudadera.glb",
      categoria: "Pantalones y Sudaderas"
    }
  ]);

  const eliminarArticulo = (id) => {
    if (window.confirm("¿Eliminar este artículo?")) {
      setArticulos(articulos.filter(a => a.id !== id));
    }
  };

  const editarArticulo = (id) => {
    alert(`Aquí puedes abrir modal o redirigir para editar el artículo con ID ${id}`);
  };

  return (
    <div className="admin-articulos">
      <h2>Gestión de Artículos</h2>
      <table className="articulos-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Imagen</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Modelo 3D</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((art) => (
            <tr key={art.id}>
              <td>{art.nombre}</td>
              <td><img src={art.imagen} alt={art.nombre} className="img-preview" /></td>
              <td>{art.descripcion}</td>
              <td>{art.precio}</td>
              <td>{art.modelo3D}</td>
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
