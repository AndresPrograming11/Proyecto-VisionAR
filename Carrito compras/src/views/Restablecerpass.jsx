import { useState } from "react";
import "../style/RestablecerPass.css";

function RestablecerPass() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSendToken = async () => {
    try {
      const response = await fetch('http://localhost/backend/send_token.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: correo })
    });

      const data = await response.json();

      if (data.message === 'Correo enviado') {
        setMensaje("Token enviado al correo electrónico");
      } else {
        setMensaje(data.message || "Error al enviar el correo");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error de conexión con el servidor");
    }
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
          <h2>Ingrese el correo que proporcionó al momento del registro</h2>
        </div>        
        <label className="label">Correo</label>
        <input type="email" placeholder="Ingresa tu correo" onChange={(e) => setCorreo(e.target.value)} />  
        <button onClick={handleSendToken}>Enviar correo</button>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
}

export default RestablecerPass;
