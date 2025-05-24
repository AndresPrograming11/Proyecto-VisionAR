import { useState } from "react";
import "../style/camisas.css";
import ModalCamisa from "../views/ModalCamisa"; // ajusta la ruta si es necesario

function Camisas() {
  // Ejemplo de estado y uso
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

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
        <div className="camisa-card" onClick={() => abrirModal({ nombre: "Camisa Azul", precio: 4000, imagen: "https://http2.mlstatic.com/D_NQ_NP_696638-MCO75131653897_032024-O.webp" })}>
          <img src="https://http2.mlstatic.com/D_NQ_NP_696638-MCO75131653897_032024-O.webp" alt="Camisa Azul" className="camisa-img" />
          <h3>Camisa Azul</h3>
          <p>$4000</p>
        </div>
        <div className="camisa-card" onClick={() => abrirModal({ nombre: "Camisa Roja", precio: 1200, imagen: "https://http2.mlstatic.com/D_NQ_NP_674679-MCO75132097525_032024-O.webp" })}>
          <img src="https://http2.mlstatic.com/D_NQ_NP_674679-MCO75132097525_032024-O.webp" alt="Camisa Roja" className="camisa-img" />
          <h3>Camisa Roja</h3>
          <p>$1200</p>
        </div>
        <div className="camisa-card" onClick={() => abrirModal({ nombre: "Camisa Verde", precio: 700, imagen: "https://http2.mlstatic.com/D_NQ_NP_696638-MCO75131653897_032024-O.webp" })}>
          <img src="https://http2.mlstatic.com/D_NQ_NP_696638-MCO75131653897_032024-O.webp" alt="Camisa Verde" className="camisa-img" />
          <h3>Camisa Verde</h3>
          <p>$700</p>
        </div>
        <div className="camisa-card" onClick={() => abrirModal({ nombre: "Camisa Negra", precio: 800, imagen: "https://http2.mlstatic.com/D_NQ_NP_696638-MCO75131653897_032024-O.webp" })}>
          <img src="https://http2.mlstatic.com/D_NQ_NP_696638-MCO75131653897_032024-O.webp" alt="Camisa Negra" className="camisa-img" />
          <h3>Camisa Negra</h3>
          <p>$800</p>
        </div>
        {/* Repite la estructura para las demás camisas */}
      </div>

      {/* Modal */}
      {modalAbierto && (
        <ModalCamisa producto={productoSeleccionado} onClose={cerrarModal} />
      )}
    </div>
  );
}

export default Camisas;
