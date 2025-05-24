import { useState } from "react";
import "../style/RestablecerPass.css";

function CambiarClave() {
  const [token, setToken] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChangePassword = async () => {
    setMensaje("");
    setError("");

    if (!token) {
      setError("Por favor, ingresa el token recibido por correo.");
      return;
    }
    if (!nuevaContrasena) {
      setError("Por favor, ingresa la nueva contraseña.");
      return;
    }

    setCargando(true);

    try {
        const response = await fetch("http://localhost/carrito-backend/gestionar_usuarios.php", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: token, nuevaContrasena: nuevaContrasena }),
          });
          
      const text = await response.text();

      try {
        const data = JSON.parse(text);

        if (response.ok) {
          setMensaje(data.message || "Contraseña cambiada correctamente.");
        } else {
          setError(data.error || "Error al cambiar la contraseña.");
        }
      } catch (e) {
        setError(`Error parseando respuesta del servidor: ${text}`);
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
        />

        <label className="label">Nueva contraseña</label>
        <input
          type="password"
          placeholder="Ingresa la nueva contraseña"
          value={nuevaContrasena}
          onChange={(e) => setNuevaContrasena(e.target.value)}
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