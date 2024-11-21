import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Spinner, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const userData = {
      email,
      password,
    };

    axios
      .post("http://localhost:3000/usuarios/login", userData)
      .then((response) => {
        // Se guarda el token
        const token = response.data.token;
        const id = response.data.id;
        localStorage.setItem("authToken", token);
        console.log("Token guardado", token);
        localStorage.setItem("id", id);
        console.log("Id guardado", id);
        setLoading(false);
        console.log("Usuario logueado con éxito", response.data);
        navigate("/home")
        //TODO: redirigir a alguna pagina
      })
      .catch((error) => {
        setLoading(false);
        setError("Error al iniciar sesión. Verifica tus credenciales.");
        console.error("Error al iniciar sesión", error);
      });
  };

  //TODO: centrar botones o mejorar ui
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="login-form p-4 shadow-sm rounded bg-light">
            <h2 className="text-center mb-4 text-primary">Iniciar Sesión</h2>
            <Form onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger">{error}</div>}

              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Ingresa tu email"
                  className="input-style"
                />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Ingresa tu contraseña"
                  className="input-style"
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                block
                disabled={loading}
                className="mt-3 btn-lg"
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </Form>

            <div className="mt-3 d-flex justify-content-center">
              <Button
                variant="link"
                onClick={() => navigate("/registro")}
                className="btn-link"
              >
                Regístrate
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
