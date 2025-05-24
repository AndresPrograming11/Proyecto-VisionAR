import "../style/PantalonesYSudaderas.css";

function pantalonesYSudaderas() {
  return (
    <div className="pantalones-container">
      <h1>PANTALONES</h1>
      <div className="pantalones-grid"> {/* Aquí debería estar "pantalones-grid" con "p" minúscula */}
        <div className="pantalon-card">
          <img src="https://http2.mlstatic.com/D_NQ_NP_696638-MCO75131653897_032024-O.webp" alt="Camisa Azul" className="pantalones-img" />
          <h3>Camisa Azul</h3>
          <p>$4000</p>
        </div>
        <div className="pantalon-card">
          <img src="https://http2.mlstatic.com/D_NQ_NP_674679-MCO75132097525_032024-O.webp" alt="Camisa Roja" className="pantalones-img" />
          <h3>Camisa Roja</h3>
          <p>$1200</p>
        </div>
        <div className="pantalon-card">
          <img src="https://http2.mlstatic.com/D_NQ_NP_696638-MCO75131653897_032024-O.webp" alt="Camisa Verde" className="pantalones-img" />
          <h3>Camisa Verde</h3>
          <p>$700</p>
        </div>
        <div className="pantalon-card">
          <img src="https://http2.mlstatic.com/D_NQ_NP_696638-MCO75131653897_032024-O.webp" alt="Camisa Negra" className="pantalones-img" />
          <h3>Camisa Negra</h3>
          <p>$800</p>
        </div>
        {/* Repite la estructura para las demás camisas */}
      </div>
    </div>
  );
}

export default pantalonesYSudaderas;
