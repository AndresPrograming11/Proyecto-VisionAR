import { useState, useEffect } from "react";
import "../style/AdminUsuarios.css";
import {
  obtenerUsuarios,
  eliminarUsuario as eliminarUsuarioAPI,
  actualizarUsuario as actualizarUsuarioAPI,
} from "../services/gestionar_usuarios";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [contraseña, setContraseña] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    };
    fetchUsuarios();
  }, []);

  const eliminarUsuario = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirmacion) return;

    const result = await eliminarUsuarioAPI(id);
    if (result.success) {
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      alert("Usuario eliminado correctamente");
    } else {
      alert("Error al eliminar usuario: " + result.message);
    }
  };

  const editarUsuario = (id) => {
    const usuario = usuarios.find((u) => u.id === id);
    if (usuario) {
      setUsuarioEditando(usuario);
      setNombre(usuario.nombre);
      setCorreo(usuario.correo);
      setUsername(usuario.username);
      setRole(usuario.role);
      setContraseña("");
      setMostrarModal(true);
    }
  };

  const guardarCambios = async () => {
    const usuarioActualizado = {
      id: usuarioEditando.id,
      nombre,
      correo,
      username,
      role,
      contrasena: contraseña,
    };

    const result = await actualizarUsuarioAPI(usuarioActualizado);

    if (result.success) {
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === usuarioEditando.id
            ? { ...u, nombre, correo, username, role }
            : u
        )
      );
      alert("Usuario actualizado correctamente");
      setMostrarModal(false);
    } else {
      alert("Error al actualizar usuario: " + result.message);
    }
  };

  return (
    <div className="admin-usuarios">
      <h2>Gestión de Usuarios</h2>
      <table className="usuarios-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Contraseña</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.username}</td>
              <td>{usuario.role}</td>
              <td>**********</td>
              <td>
                <button onClick={() => editarUsuario(usuario.id)} className="btn-editar">Editar</button>
                <button onClick={() => eliminarUsuario(usuario.id)} className="btn-eliminar">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <div className="Modal-overlay">
          <div className="Modal-content">
            <button className="Modal-close" onClick={() => setMostrarModal(false)}>×</button>
            <h2>Editar Usuario</h2>
            <div className="Modal-grid">
              <label>Nombre</label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

              <label>Correo</label>
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />

              <label>Usuario</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} />

              <label>Rol</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              
            </div>
            <button className="btn-guardar" onClick={guardarCambios}>Guardar Cambios</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsuarios;
