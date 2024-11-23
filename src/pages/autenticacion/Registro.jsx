import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Registro.css";
import { useNavigate } from "react-router-dom";

const Registro = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rolId, setRolId] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/rol/")
      .then((response) => {
        setRoles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los roles", error);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const userData = {
      nombre,
      email,
      password,
      rolId,
    };

    axios
      .post("http://localhost:3000/usuarios/register", userData)
      .then((response) => {
        console.log("Usuario registrado con éxito", response.data);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error al registrar el usuario", error);
        setError(
          error.response?.data?.message || "Error al registrar el usuario"
        );
      });
  };

  return (
    <div className="registro-page">
    <h1 className="registro-title">Regístrate</h1>
    <p className="registro-subtitle">
      ¿Ya tienes una cuenta?{" "}
      <span className="registro-login" onClick={() => navigate("/login")}>
        Inicia sesión
      </span>
    </p>
    <form onSubmit={handleSubmit} className="registro-form">
      {error && <div className="registro-error">{error}</div>}

      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre completo"
        required
        className="registro-input"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        required
        className="registro-input"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
        className="registro-input"
      />
      <select
        value={rolId}
        onChange={(e) => setRolId(e.target.value)}
        required
        className="registro-input"
      >
        <option value="">Selecciona un rol</option>
        {loading ? (
          <option value="">Cargando roles...</option>
        ) : (
          roles.map((rol) => (
            <option key={rol.id} value={rol.id}>
              {rol.nombre}
            </option>
          ))
        )}
      </select>

      <button type="submit" className="registro-button">
        Registrar
      </button>
    </form>
  </div>
);
};

export default Registro;
