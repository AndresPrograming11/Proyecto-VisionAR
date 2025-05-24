import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/RestablecerPass.css";

function Registro() {
  
  const [correo, setCorreo] = useState("");

  const navigate = useNavigate();

  const handleRegister = () => {
    
    console.log("Datos del usuario:",  correo  );

   
    navigate("/login");
  };

  return (
    <div className="contenedor">
      <div className="imagen-container">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCVqZ6USYoOOVuZQfnOXIZyhjcI0zByB1m5rqf1t64acPmhU-LGbUvyZcl_cePadiOyxE&usqp=CAU"
          alt="logo universidad"
        />
      </div>
      <div className="formulario">
        <div className="mensaje">
          <h1>Restablecer contraseña</h1>
          <h2>ingrese el correo que proporciono al</h2>
          <h2>momento del registro</h2>
        </div>        
        <label className="label">Correo</label>
        <input type="email" placeholder="Ingresa tu correo" onChange={(e) => setCorreo(e.target.value)} />  
        <button onClick={handleRegister}>Enviar correo</button>        
      </div>
    </div>
  );
}

export default Registro;
