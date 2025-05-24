import { useState } from "react";
import "../style/RestablecerPass.css";

function RestablecerPass() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleResetPassword = async () => {
    setMensaje("");
    setError("");

    if (!correo) {
      setError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    setCargando(true);

    try {
      const response = await fetch("http://localhost/carrito-backend/Models/request-reset.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: correo }),
      });

      const text = await response.text();

      try {
        const data = JSON.parse(text);

        if (response.ok) {
          setMensaje(data.message || "Se envió un enlace de restablecimiento a tu correo.");
        } else {
          setError(data.error || "Error al enviar correo.");
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
          <h1>Restablecer contraseña</h1>
          <h2>Ingresa el correo que proporcionaste al momento del registro</h2>
        </div>
        <label className="label">Correo</label>
        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <button onClick={handleResetPassword} disabled={cargando}>
          {cargando ? "Enviando..." : "Enviar correo"}
        </button>
        {mensaje && (
          <div className="mensaje-success">
            {mensaje}
            <p>Una vez que tengas el token, dirígete a <a href="/cambiarclave">Cambiar contraseña</a>.</p>
          </div>
        )}
        {error && <div className="mensaje-error">{error}</div>}
      </div>
    </div>
  );
}

export default RestablecerPass;