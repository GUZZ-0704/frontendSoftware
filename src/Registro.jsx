import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Spinner, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Registro.css"; // Assuming custom styles for additional tweaks

const Registro = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rolId, setRolId] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

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
      })
      .catch((error) => {
        console.error("Error al registrar el usuario", error);
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="registro-form p-4 shadow-sm rounded bg-light">
            <h2 className="text-center mb-4 text-primary">Registrar Usuario</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  placeholder="Ingresa tu nombre"
                  className="input-style"
                />
              </Form.Group>

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

              <Form.Group controlId="rol">
                <Form.Label>Rol</Form.Label>
                <Form.Control
                  as="select"
                  value={rolId}
                  onChange={(e) => setRolId(e.target.value)}
                  required
                  className="input-style"
                >
                  <option value="">Selecciona un rol</option>
                  {loading ? (
                    <option value="">
                      <Spinner animation="border" size="sm" /> Cargando roles...
                    </option>
                  ) : (
                    roles.map((rol) => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombre}
                      </option>
                    ))
                  )}
                </Form.Control>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                block
                className="mt-3 btn-lg"
              >
                Registrar
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Registro;
