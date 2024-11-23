import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const userData = {
      email,
      password,
    };
    try {
      const response = await axios.post("http://localhost:3000/usuarios/login", userData);

      // Guardar el token y el ID en localStorage
      const { token, id } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("id", id);

      console.log("Inicio de sesión exitoso:", response.data);

      // Redirigir al usuario
      navigate("/misProyectos");
  } catch (error) {
      setLoading(false);

      if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
      } else {
          setError("Error al iniciar sesión. Verifica tus credenciales.");
      }

      console.error("Error al iniciar sesión:", error);
  } finally {
      setLoading(false);
  }
  };

  return (
    <div className="login-page">
    <h1 className="login-title">Inicia sesión</h1>
    <p className="login-subtitle">
      ¿Aún no tienes una cuenta?{" "}
      <span
        className="login-register"
        onClick={() => navigate("/registro")}
      >
        Regístrate
      </span>
    </p>
    <form onSubmit={handleSubmit} className="login-form">
      {error && <div className="login-error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        required
        className="login-input"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
        className="login-input"
      />
      <button type="submit" className="login-button">
        {loading ? "Cargando..." : "Login"}
      </button>
    </form>
    <footer className="login-footer">
      <p>
        <a href="#">


        </a>
      </p>

    </footer>
  </div>
);
};



export default Login;
