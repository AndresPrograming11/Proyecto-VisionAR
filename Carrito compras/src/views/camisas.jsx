import React, { useState, useEffect } from "react";
import "../style/camisas.css";
import ModalProducto from "../views/ModalProducto"; 
import { obtenerArticulos } from "../services/articulos"; 

function Camisas({ setCarritoItems }) {
  const [camisasData, setCamisasData] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerArticulos();
        if (data && Array.isArray(data)) {
          // Filtrar solo las camisas
          const camisas = data.filter(item => item.categoria === "Camisas");
          setCamisasData(camisas);
        } else {
          console.error("Datos inválidos:", data);
        }
      } catch (error) {
        console.error("Error al obtener camisas:", error);
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
    <div className="camisas-container">
      <h1>CAMISAS</h1>
      <div className="camisas-grid">
        {camisasData.map(camisa => (
          <div className="camisa-card" key={camisa.id} onClick={() => abrirModal(camisa)}>
            <img src={camisa.imagen} alt={camisa.nombre} className="camisa-img" />
            <h3>{camisa.nombre}</h3>
            <p>${parseFloat(camisa.precio).toFixed(2)}</p>
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

export default Camisas;
