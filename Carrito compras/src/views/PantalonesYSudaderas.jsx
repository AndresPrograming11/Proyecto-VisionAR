import "../style/PantalonesYSudaderas.css";
import React, { useState, useEffect } from "react";
import "../style/PantalonesYSudaderas.css";
import ModalProducto from "../views/ModalProducto"; 
import { obtenerArticulos } from "../services/articulos"; 
const BASE_URL = "http://localhost/carrito-backend/";

function PantalonesYSudaderas({ setCarritoItems }) { 
  const [pantalonesData, setPantalonesData] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerArticulos();
        if (data && Array.isArray(data)) {
          // Filtrar solo los pantalones
          const pantalones = data.filter(item => item.categoria === "pantalones");
          setPantalonesData(pantalones);
        } else {
          console.error("Datos inválidos:", data);
        }
      } catch (error) {
        console.error("Error al obtener pantalones:", error);
      }
    };
    fetchData();
  }, []);

  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
  };

  return (
    <div className="pantalones-container">
      <h1>PANTALONES</h1>
      <div className="pantalones-grid">
        {pantalonesData.map(pantalon => (
          <div className="pantalon-card" key={pantalon.id} onClick={() => abrirModal(pantalon)}>
            <img src={`${BASE_URL}${pantalon.imagen}`} alt={pantalon.nombre} className="pantalon-img" />
            <h3>{pantalon.nombre}</h3>
            <p>${parseInt(pantalon.precio)}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalAbierto && productoSeleccionado && (
        <ModalProducto
          producto={productoSeleccionado}
          onClose={cerrarModal}
          setCarritoItems={setCarritoItems} 
        />
      )}
    </div>
  );
}

export default PantalonesYSudaderas;
