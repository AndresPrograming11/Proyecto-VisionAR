import React, { useState, useEffect } from "react";
import "../style/uniformes.css";
import ModalProducto from "../views/ModalProducto"; 
import { obtenerArticulos } from "../services/articulos"; 
const BASE_URL = "http://localhost/carrito-backend/";

function Uniformes({ setCarritoItems }) { 
  const [uniformesData, setUniformesData] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerArticulos();
        if (data && Array.isArray(data)) {
          // Filtrar solo los uniformes
          const uniformes = data.filter(item => item.categoria === "uniformes");
          setUniformesData(uniformes);
        } else {
          console.error("Datos inválidos:", data);
        }
      } catch (error) {
        console.error("Error al obtener uniformes:", error);
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
    <div className="uniformes-container">
      <h1>UNIFORMES</h1>
      <div className="uniformes-grid">
        {uniformesData.map(uniforme => (
          <div className="uniforme-card" key={uniforme.id} onClick={() => abrirModal(uniforme)}>
            <img src={`${BASE_URL}${uniforme.imagen}`} alt={uniforme.nombre} className="uniforme-img" />
            <h3>{uniforme.nombre}</h3>
            <p>${parseInt(uniforme.precio)}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalAbierto && productoSeleccionado && (
        <ModalProducto
          producto={productoSeleccionado}
          onClose={cerrarModal}
          setCarritoItems={setCarritoItems} // Pasamos la función al Modal
        />
      )}
    </div>
  );
}

export default Uniformes;
