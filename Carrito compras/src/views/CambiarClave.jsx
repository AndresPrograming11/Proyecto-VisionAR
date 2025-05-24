import { useState } from "react";
import "../style/RestablecerPass.css";
import { cambiarContrasenaConToken } from "../services/gestionar_usuarios"; // Importa la función

function CambiarClave() {
  const [token, setToken] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChangePassword = async () => {
    setMensaje("");
    setError("");

    if (!token.trim()) {
      setError("Por favor, ingresa el token recibido por correo.");
      return;
    }
    if (nuevaContrasena.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setCargando(true);

    try {
      const response = await cambiarContrasenaConToken(token, nuevaContrasena); // Usa la función importada

      if (response.success) {
        setMensaje(response.message);
        setToken("");
        setNuevaContrasena("");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(`Error al conectar con el servidor: ${err.message}`);
    } finally {
      setCargando(false);
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
          <h1>Cambiar contraseña</h1>
          <h2>Ingresa el token recibido y la nueva contraseña</h2>
        </div>

        <label className="label">Token</label>
        <input
          type="text"
          placeholder="Ingresa el token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          disabled={cargando}
        />

        <label className="label">Nueva contraseña</label>
        <input
          type="password"
          placeholder="Ingresa la nueva contraseña"
          value={nuevaContrasena}
          onChange={(e) => setNuevaContrasena(e.target.value)}
          disabled={cargando}
        />

        <button onClick={handleChangePassword} disabled={cargando}>
          {cargando ? "Cambiando..." : "Cambiar contraseña"}
        </button>

        {mensaje && <div className="mensaje-success">{mensaje}</div>}
        {error && <div className="mensaje-error">{error}</div>}
      </div>
    </div>
  );
}

export default CambiarClave;
