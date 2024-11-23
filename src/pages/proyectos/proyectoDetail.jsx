import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Card,
  Button,
  Modal,
  Form,
  ListGroup,
  Alert,
} from "react-bootstrap";
import "./ProyectoDetail.css";
import Sidebar from "./../../components/SideBar";
import Header from "./../../components/Header";

const ProyectoDetail = () => {
  const token = localStorage.getItem("authToken");
  const { id } = useParams(); // ID del proyecto
  const userId = localStorage.getItem("id"); // ID del usuario logueado
  const [proyecto, setProyecto] = useState({});
  const [tareas, setTareas] = useState([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "usuario", "tarea", "inventario", "editarTarea", "editarInventario"
  const [tareaData, setTareaData] = useState({ titulo: "", descripcion: "" });
  const [inventarioData, setInventarioData] = useState({
    nombre: "",
    descripcion: "",
    cantidad: 0,
    precio: 0,
  });
  const [editableItem, setEditableItem] = useState(null);

  const esAdministrador = proyecto.administrador?.id === parseInt(userId);

  useEffect(() => {
    loadProyecto();
    loadUsuariosDisponibles();
    document.title = "Detalle del Proyecto";
  }, [id]);

  const loadProyecto = () => {
    axios
      .get(`http://localhost:3000/proyectos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProyecto(response.data);
        setTareas(response.data.tareas);
      })
      .catch((error) => console.error("Error al cargar el proyecto:", error));
  };

  const loadUsuariosDisponibles = () => {
    axios
      .get("http://localhost:3000/usuarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setUsuariosDisponibles(response.data))
      .catch((error) => console.error("Error al cargar usuarios:", error));
  };

  const abrirModal = (type, item = null) => {
    setModalType(type);
    setShowModal(true);
    setEditableItem(item);

    if (type === "editarTarea" && item) {
      setTareaData({ titulo: item.titulo, descripcion: item.descripcion });
    } else if (type === "editarInventario" && item) {
      setInventarioData({ ...item });
    } else {
      setTareaData({ titulo: "", descripcion: "" });
      setInventarioData({
        nombre: "",
        descripcion: "",
        cantidad: 0,
        precio: 0,
      });
    }
  };

  const cerrarModal = () => {
    setShowModal(false);
    setModalType("");
    setEditableItem(null);
  };

  const agregarUsuario = () => {
    if (!nuevoUsuario) return;
    axios
      .post(
        `http://localhost:3000/proyectos/usuario/${id}`,
        {
          usuarioId: nuevoUsuario,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert("Usuario agregado correctamente");
        loadProyecto();
        cerrarModal();
      })
      .catch((error) => console.error("Error al agregar usuario:", error));
  };

  const guardarTarea = () => {
    if (modalType === "tarea") {
      axios
        .post(
          "http://localhost:3000/tareas",
          {
            ...tareaData,
            estado: "Pendiente",
            proyectoId: id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          alert("Tarea creada correctamente");
          loadProyecto();
          cerrarModal();
        })
        .catch((error) => console.error("Error al crear tarea:", error));
    }
  };

  const editarTarea = () => {
    axios
      .put(`http://localhost:3000/tareas/${editableItem.id}`, tareaData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Tarea actualizada correctamente");
        loadProyecto();
        cerrarModal();
      })
      .catch((error) => console.error("Error al actualizar tarea:", error));
  };

  const guardarInventario = () => {
    if (modalType === "inventario") {
      axios
        .post(
          "http://localhost:3000/inventarios",
          {
            ...inventarioData,
            proyectoId: id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          alert("Inventario creado correctamente");
          loadProyecto();
          cerrarModal();
        })
        .catch((error) => console.error("Error al crear inventario:", error));
    }
  };

  const editarInventario = () => {
    axios
      .put(
        `http://localhost:3000/inventarios/${editableItem.id}`,
        inventarioData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert("Inventario actualizado correctamente");
        loadProyecto();
        cerrarModal();
      })
      .catch((error) =>
        console.error("Error al actualizar inventario:", error)
      );
  };

  const eliminarUsuario = (usuarioId) => {
    axios
      .delete(`http://localhost:3000/proyectos/usuario/${id}`, {
        data: { usuarioId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Usuario eliminado correctamente");
        loadProyecto();
      })
      .catch((error) => console.error("Error al eliminar usuario:", error));
  };

  const eliminarTarea = (tareaId) => {
    axios
      .delete(
        `http://localhost:3000/proyectos/tarea/${id}`,
        {
          data: { tareaId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert("Tarea eliminada correctamente");
        loadProyecto();
      })
      .catch((error) => console.error("Error al eliminar tarea:", error));
  };

  const eliminarInventario = (inventarioId) => {
    axios
      .delete(
        `http://localhost:3000/proyectos/inventario/${id}`,
        {
          data: { inventarioId },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert("Inventario eliminado correctamente");
        loadProyecto();
      })
      .catch((error) => console.error("Error al eliminar inventario:", error));
  };

  const eliminarProyecto = (proyectoId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
      axios
        .delete(`http://localhost:3000/proyectos/${proyectoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          alert("Proyecto eliminado correctamente");
          window.location.href = "/misProyectos";
        })
        .catch((error) =>
          console.error("Error al eliminar el proyecto:", error)
        );
    }
  };

  return (
    <div className="main-container">
      <Header title="RavenTech" />
      <div className="content-wrapper">
        <Sidebar />
        <div className="content-area">
          <Container fluid className="container-project-detail">
            <div className="header-top-container">
              <h1 className="header-title">Detalle del Proyecto</h1>
            </div>

            {/* Proyecto Detalle */}
            <Card className="project-card mb-4">
              <Card.Body>
                <div className="card-header-detalle">
                  <Card.Title>{proyecto.nombre}</Card.Title>
                  <p className="estado-proyecto">{proyecto.estado}</p>
                </div>
                <Card.Text>{proyecto.descripcion}</Card.Text>
                {esAdministrador && (
                  <>
                    <Button
                      className="custom-button"
                      onClick={() => abrirModal("usuario")}
                    >
                      <i className="bi bi-person-plus-fill"></i> Agregar Usuario
                    </Button>
                    <Button
                      className="custom-button"
                      onClick={() => abrirModal("tarea")}
                    >
                      <i className="bi bi-file-earmark-plus-fill"></i> Crear
                      Tarea
                    </Button>
                    <Button
                      className="custom-button"
                      onClick={() => abrirModal("inventario")}
                    >
                      <i className="bi bi-building-add"></i> Crear Inventario
                    </Button>
                    <Button
                      className="custom-button-secondary"
                      onClick={() => eliminarProyecto(proyecto.id)}
                    >
                      <i className="bi bi-trash-fill"></i> Eliminar Proyecto
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>

            {/* Usuarios */}
            <div className="section-container">
              <h2 className="section-title">Usuarios</h2>
              {proyecto.equipo?.length === 0 ? (
                <div className="empty-users-alert">
                  <Alert variant="info">
                    No hay usuarios asignados a este proyecto
                  </Alert>
                </div>
              ) : (
                <ul className="user-list">
                  {proyecto.equipo?.map((usuario) => (
                    <li key={usuario.id} className="user-item">
                      <span className="user-name">{usuario.nombre}</span>
                      <span className="user-email">({usuario.email})</span>
                      {esAdministrador && (
                        <button
                          className="user-delete-button"
                          onClick={() => eliminarUsuario(usuario.id)}
                        >
                          Eliminar
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Tareas */}
            <div className="section-container">
              <h2 className="section-title">Tareas</h2>
              {tareas.length === 0 ? (
                <div className="empty-tasks-alert">
                  <Alert variant="info">No hay tareas en este proyecto</Alert>
                </div>
              ) : (
                <div className="tasks-grid">
                  {tareas.map((tarea) => (
                    <div key={tarea.id} className="task-card">
                      <div className="task-header">
                        <h3 className="task-title">{tarea.titulo}</h3>
                        <div
                          className={`task-status-pill ${
                            tarea.estado === "hecha"
                              ? "status-completed"
                              : "status-pending"
                          }`}
                          onClick={() => {
                            const nuevoEstado =
                              tarea.estado === "hecha" ? "pendiente" : "hecha";
                            axios
                              .put(`http://localhost:3000/tareas/${tarea.id}`, {
                                estado: nuevoEstado,
                              })
                              .then(() => loadProyecto())
                              .catch((error) =>
                                console.error(
                                  "Error al cambiar estado de la tarea:",
                                  error
                                )
                              );
                          }}
                        >
                          {tarea.estado === "hecha"
                            ? "Completada"
                            : "Pendiente"}
                        </div>
                      </div>
                      <p className="task-description">{tarea.descripcion}</p>
                      {esAdministrador && (
                        <div className="task-actions">
                          <button
                            className="task-action-button edit-button"
                            onClick={() => abrirModal("editarTarea", tarea)}
                          >
                            <i className="bi bi-pencil-fill"></i> Editar
                          </button>
                          <button
                            className="task-action-button delete-button"
                            onClick={() => eliminarTarea(tarea.id)}
                          >
                            <i className="bi bi-trash-fill"></i> Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inventario */}
            <div className="section-container">
              <h2 className="section-title">Inventario</h2>
              {proyecto.inventarios?.length === 0 ? (
                <Alert variant="info" className="inventory-alert">
                  No hay inventario en este proyecto
                </Alert>
              ) : (
                <ListGroup className="inventory-list">
                  {proyecto.inventarios?.map((item) => (
                    <ListGroup.Item key={item.id} className="inventory-item">
                      <div className="inventory-content">
                        <div className="inventory-details">
                          <h5 className="inventory-name">{item.nombre}</h5>
                          <p className="inventory-description">
                            {item.descripcion}
                          </p>
                          <div className="inventory-meta">
                            <span>
                              <strong>Cantidad:</strong> {item.cantidad}
                            </span>
                            <span>
                              <strong>Precio:</strong> ${item.precio}
                            </span>
                          </div>
                        </div>
                        {esAdministrador && (
                          <div className="inventory-actions">
                            <Button
                              className="custom-button edit-inventory"
                              size="sm"
                              onClick={() =>
                                abrirModal("editarInventario", item)
                              }
                            >
                              Editar
                            </Button>
                            <Button
                              className="custom-button-secondary"
                              size="sm"
                              onClick={() => eliminarInventario(item.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          </Container>
        </div>
      </div>
      {/* Modal */}
      <Modal show={showModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "usuario" && "Agregar Usuario"}
            {modalType === "tarea" && "Crear Tarea"}
            {modalType === "editarTarea" && "Editar Tarea"}
            {modalType === "inventario" && "Crear Inventario"}
            {modalType === "editarInventario" && "Editar Inventario"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "usuario" && (
            <Form.Group>
              <Form.Label>Usuario</Form.Label>
              <Form.Select
                value={nuevoUsuario}
                onChange={(e) => setNuevoUsuario(e.target.value)}
              >
                <option value="">Seleccione un usuario</option>
                {usuariosDisponibles.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
          {modalType === "tarea" && (
            <>
              <Form.Group>
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  value={tareaData.titulo}
                  onChange={(e) =>
                    setTareaData({ ...tareaData, titulo: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={tareaData.descripcion}
                  onChange={(e) =>
                    setTareaData({ ...tareaData, descripcion: e.target.value })
                  }
                />
              </Form.Group>
            </>
          )}
          {modalType === "editarTarea" && (
            <>
              <Form.Group>
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  value={tareaData.titulo}
                  onChange={(e) =>
                    setTareaData({ ...tareaData, titulo: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={tareaData.descripcion}
                  onChange={(e) =>
                    setTareaData({ ...tareaData, descripcion: e.target.value })
                  }
                />
              </Form.Group>
            </>
          )}
          {modalType === "inventario" && (
            <>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={inventarioData.nombre}
                  onChange={(e) =>
                    setInventarioData({
                      ...inventarioData,
                      nombre: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={inventarioData.descripcion}
                  onChange={(e) =>
                    setInventarioData({
                      ...inventarioData,
                      descripcion: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  value={inventarioData.cantidad}
                  onChange={(e) =>
                    setInventarioData({
                      ...inventarioData,
                      cantidad: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  value={inventarioData.precio}
                  onChange={(e) =>
                    setInventarioData({
                      ...inventarioData,
                      precio: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </>
          )}
          {modalType === "editarInventario" && (
            <>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={inventarioData.nombre}
                  onChange={(e) =>
                    setInventarioData({
                      ...inventarioData,
                      nombre: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={inventarioData.descripcion}
                  onChange={(e) =>
                    setInventarioData({
                      ...inventarioData,
                      descripcion: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  value={inventarioData.cantidad}
                  onChange={(e) =>
                    setInventarioData({
                      ...inventarioData,
                      cantidad: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  value={inventarioData.precio}
                  onChange={(e) =>
                    setInventarioData({
                      ...inventarioData,
                      precio: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={
              modalType === "usuario"
                ? agregarUsuario
                : modalType === "tarea"
                ? guardarTarea
                : modalType === "editarTarea"
                ? editarTarea
                : modalType === "inventario"
                ? guardarInventario
                : editarInventario
            }
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProyectoDetail;
