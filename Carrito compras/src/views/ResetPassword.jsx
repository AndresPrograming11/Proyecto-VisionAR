import { useState } from "react";
import { useNavigate } from "react-router-dom";


function ResetPassword() {
  const [correo, setCorreo] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
        const response = await fetch('http://localhost/reset_password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: correo, token: token, new_password: newPassword })
      });

      const data = await response.json();

      if (data.message === 'Contraseña actualizada') {
        setMensaje("Contraseña actualizada exitosamente");
        navigate("/login");
      } else {
        setMensaje(data.message || "Error al actualizar la contraseña");
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
          <h2>Ingrese el token recibido y su nueva contraseña</h2>
        </div>        
        <label className="label">Correo</label>
        <input type="email" placeholder="Ingresa tu correo" onChange={(e) => setCorreo(e.target.value)} />
        <label className="label">Token</label>
        <input type="text" placeholder="Ingresa tu token" onChange={(e) => setToken(e.target.value)} />
        <label className="label">Nueva Contraseña</label>
        <input type="password" placeholder="Ingresa tu nueva contraseña" onChange={(e) => setNewPassword(e.target.value)} />
        <button onClick={handleReset}>Restablecer contraseña</button>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
