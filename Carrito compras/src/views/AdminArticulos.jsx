import { useEffect, useState } from "react";
import "../style/AdminArticulos.css";
import { obtenerArticulos } from "../services/articulos";
import { eliminarArticuloPorId, actualizarArticulo } from "../services/gestionar_articulos";

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
  } catch {
    return false;
  }
};

function AdminArticulos() {
  const [articulos, setArticulos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [articuloEditando, setArticuloEditando] = useState(null);

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState(null);
  const [glb, setGlb] = useState(null);
  const [usdz, setUsdz] = useState(null);

  const fetchData = async () => {
    const data = await obtenerArticulos();
    if (Array.isArray(data)) {
      setArticulos(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const eliminarArticulo = async (id) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este artículo?");
    if (confirm) {
      const res = await eliminarArticuloPorId(id);
      if (res.success) {
        fetchData();
      } else {
        alert("Error al eliminar");
      }
    }
  };

  const abrirModalEdicion = (art) => {
    setArticuloEditando(art);
    setNombre(art.nombre);
    setPrecio(art.precio);
    setDescripcion(art.descripcion);
    setCategoria(art.categoria);
    setMostrarModal(true);
  };

  const guardarCambios = async () => {
    const formData = new FormData();
    formData.append("id", articuloEditando.id);
    formData.append("nombre", nombre);
    formData.append("precio", precio);
    formData.append("descripcion", descripcion);
    formData.append("categoria", categoria);
    if (imagen) formData.append("imagen", imagen);
    if (glb) formData.append("modeloGLB", glb);
    if (usdz) formData.append("modeloUSDZ", usdz);
  
    const res = await actualizarArticulo(formData);
  
    if (res.success) {
      setMostrarModal(false);
      setArticuloEditando(null);
      setNombre("");
      setPrecio("");
      setDescripcion("");
      setCategoria("");
      setImagen(null);
      setGlb(null);
      setUsdz(null);
      await fetchData(); // <---- Asegura que se actualice la vista
    } else {
      alert("Error al actualizar");
    }
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
                  />
                ) : (
                  <span>No válido</span>
                )}
              </td>
              <td>{art.descripcion}</td>
              <td>${parseFloat(art.precio)}</td>
              <td>
                {art.modelo_3D_GLB && <a href={art.modelo_3D_GLB} target="_blank" rel="noopener noreferrer">GLB</a>}
                {" / "}
                {art.modelo_3D_USDZ && <a href={art.modelo_3D_USDZ} target="_blank" rel="noopener noreferrer">USDZ</a>}
              </td>
              <td>{art.categoria}</td>
              <td>
                <button onClick={() => abrirModalEdicion(art)} className="btn-editar">Editar</button>
                <button onClick={() => eliminarArticulo(art.id)} className="btn-eliminar">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setMostrarModal(false)}>×</button>
            <h3>Editar Artículo</h3>
            <div className="modal-grid">
              <div><label>Nombre</label><input value={nombre} onChange={(e) => setNombre(e.target.value)} /></div>
              <div><label>Precio</label><input value={precio} onChange={(e) => setPrecio(e.target.value)} /></div>
              <div><label>Imagen</label><input type="file" onChange={(e) => setImagen(e.target.files[0])} /></div>
              <div style={{ gridColumn: "1 / 2" }}><label>Descripción</label><textarea rows="5" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} /></div>
              <div><label>Categoría</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  <option value="">Seleccionar categoría</option>
                  <option value="camisas">Camisas</option>
                  <option value="pantalones">Pantalones</option>
                  <option value="uniformes">Uniformes</option>
                </select>
              </div>
              <div><label>Modelo 3D GLB</label><input type="file" onChange={(e) => setGlb(e.target.files[0])} /></div>
              <div><label>Modelo 3D USDZ</label><input type="file" onChange={(e) => setUsdz(e.target.files[0])} /></div>
            </div>
            <button className="guardar-btn" onClick={guardarCambios}>Guardar Cambios</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminArticulos;
