import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";

import { Badge } from "react-bootstrap";
import Sidebar from "../../components/SideBar";
import Header from "../../components/Header";
import "./ListaProyectos.css";

const ListaProyectos = () => {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const [proyectosAdministrados, setProyectosAdministrados] = useState([]);
  const [proyectosParticipados, setProyectosParticipados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevoProyecto, setNuevoProyecto] = useState({
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    precio: "",
  });

  useEffect(() => {
    loadProyectos();
    document.title = "Mis Proyectos";
  }, [userId]);

  const loadProyectos = () => {
    axios
      .get(`http://localhost:3000/proyectos/admin/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProyectosAdministrados(response.data);
      })
      .catch((error) =>
        console.error("Error al cargar proyectos administrados:", error)
      );

    axios
      .get(`http://localhost:3000/proyectos/usuario/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProyectosParticipados(response.data);
      })
      .catch((error) =>
        console.error("Error al cargar proyectos participados:", error)
      );
  };

  const abrirModal = () => {
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setNuevoProyecto({
      nombre: "",
      descripcion: "",
      fechaInicio: "",
      fechaFin: "",
      precio: "",
    });
  };

  const crearProyecto = () => {
    if (!nuevoProyecto.nombre || !nuevoProyecto.descripcion) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }
    axios
      .post(
        "http://localhost:3000/proyectos",
        {
          ...nuevoProyecto,
          estado: "Pendiente",
          usuarioId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert("Proyecto creado correctamente");
        loadProyectos();
        cerrarModal();
      })
      .catch((error) => console.error("Error al crear el proyecto:", error));
  };

  const renderProyectoCard = (proyecto = false) => (
    <Card
      key={proyecto.id}
      className="card-proyecto"
      onClick={() => navigate("/proyecto/" + proyecto.id)}
    >
      <Badge
        className="badge-estado"
        bg={proyecto.estado === "Pendiente" ? "" : "success"}
      >
        {proyecto.estado}
      </Badge>
      <Card.Body className="card-proyecto-body">
        <div className="card-proyecto-header">
          <div className="card-icon">
            <i className="bi bi-folder2"></i>
          </div>
          <div className="card-title-container">
            <Card.Title className="card-proyecto-title">
              {proyecto.nombre}
            </Card.Title>
          </div>
        </div>
        <div className="card-proyecto-details">
          <p>
            <i className="bi bi-calendar-event"></i> Inicio:{" "}
            {new Date(proyecto.fechaInicio).toLocaleDateString()}
          </p>
          <p>
            <i className="bi bi-calendar-check"></i> Fin:{" "}
            {new Date(proyecto.fechaFin).toLocaleDateString()}
          </p>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="main-container">
      <Header title="RavenTech" />
      <div className="content-wrapper">
        <Sidebar />
        <div className="content-area">
          <Container fluid className="container-dashboard-proyectos">
            <div className="header-top-container">
              <h2 className="header-title">Proyectos</h2>
              <Button className="create-project-button" onClick={abrirModal}>
                Crear Proyecto
              </Button>
            </div>

            <div className="section-container">
              <h2 className="section-title">Proyectos que administras</h2>
              {proyectosAdministrados.length === 0 ? (
                <Alert variant="info" className="section-alert">
                  No administras ningún proyecto.
                </Alert>
              ) : (
                <Row className="g-4">
                  {proyectosAdministrados.map((proyecto) => (
                    <Col lg={3} md={6} sm={12} key={proyecto.id}>
                      {renderProyectoCard(proyecto, true)}
                    </Col>
                  ))}
                </Row>
              )}

              <h2 className="section-title">Proyectos donde participas</h2>
              {proyectosParticipados.length === 0 ? (
                <Alert variant="info" className="section-alert">
                  No participas en ningún proyecto.
                </Alert>
              ) : (
                <Row className="g-4">
                  {proyectosParticipados.map((proyecto) => (
                    <Col lg={4} md={6} sm={12} key={proyecto.id}>
                      {renderProyectoCard(proyecto)}
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </Container>
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={cerrarModal}
        centered
        size="lg"
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Crear Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="custom-label">Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nuevoProyecto.nombre}
                onChange={(e) =>
                  setNuevoProyecto({ ...nuevoProyecto, nombre: e.target.value })
                }
                placeholder="Ingresa el nombre del proyecto"
                required
                className="custom-input"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="custom-label">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={nuevoProyecto.descripcion}
                onChange={(e) =>
                  setNuevoProyecto({
                    ...nuevoProyecto,
                    descripcion: e.target.value,
                  })
                }
                placeholder="Describe el proyecto"
                required
                className="custom-input"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="custom-label">Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                value={nuevoProyecto.fechaInicio}
                onChange={(e) =>
                  setNuevoProyecto({
                    ...nuevoProyecto,
                    fechaInicio: e.target.value,
                  })
                }
                className="custom-input fecha"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="custom-label">Fecha de Fin</Form.Label>
              <Form.Control
                type="date"
                value={nuevoProyecto.fechaFin}
                onChange={(e) =>
                  setNuevoProyecto({
                    ...nuevoProyecto,
                    fechaFin: e.target.value,
                  })
                }
                className="custom-input fecha"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="custom-label">Precio</Form.Label>
              <Form.Control
                type="number"
                value={nuevoProyecto.precio}
                onChange={(e) =>
                  setNuevoProyecto({ ...nuevoProyecto, precio: e.target.value })
                }
                placeholder="Ingresa el precio del proyecto"
                className="custom-input"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={cerrarModal} className="custom-button-secondary">
            Cancelar
          </Button>
          <Button onClick={crearProyecto} className="custom-button">
            Crear
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListaProyectos;
