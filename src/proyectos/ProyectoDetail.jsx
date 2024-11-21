import { useEffect, useState } from "react";
import { useParams,  useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import MainMenu from "../components/MainMenu";

const DetalleProyecto = () => {
    const { id } = useParams();
    const userId = localStorage.getItem("id");
    const [proyecto, setProyecto] = useState({});
    const [tareas, setTareas] = useState([]);
    const [tareasModificadas, setTareasModificadas] = useState(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        loadProyecto();
        document.title = "Proyecto";
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadProyecto = () => {
        axios.get(`http://localhost:3000/proyectos/${id}`)
            .then((response) => {
                setProyecto(response.data);
                setTareas(response.data.tareas);
            })
            .catch((error) => {
                console.error("Error al cargar proyecto", error);
            });
    };

    const handleTaskChange = (taskId, checked) => {
        const newTareas = tareas.map((tarea) => {
            if (tarea.id === taskId) {
                return {
                    ...tarea,
                    // Si el checkbox está marcado, asignamos el usuarioId, si no lo está, lo dejamos como null
                    usuarioId: checked ? parseInt(userId) : null,
                };
            }
            return tarea;
        });
        setTareas(newTareas);
        setTareasModificadas((prev) => new Set(prev.add(taskId))); // Agregamos la tarea al conjunto de tareas modificadas
    };

    const saveChanges = () => {
        tareasModificadas.forEach((taskId) => {
            const tarea = tareas.find((t) => t.id === taskId);
    
            const tareaData = {
                id: tarea.id,
                titulo: tarea.titulo,
                descripcion: tarea.descripcion,
                usuarioId: tarea.usuarioId,
                proyectoId: tarea.proyectoId
            };
            axios.put(`http://localhost:3000/tareas/estado/${taskId}`, tareaData)
                .then((response) => {
                    console.log(`Respuesta de la API para la tarea ${taskId}:`, response);
                    console.log(`Tarea ${taskId} actualizada correctamente.`);
                })
                .catch((error) => {
                    console.error(`Error al actualizar tarea ${taskId}:`, error);
                });
        });
    
        setTareasModificadas(new Set()); // Limpiamos las tareas modificadas
        navigate(0);
    };

    return (
        <>
            <MainMenu />
            <Container>
            <h1>Detalles del Proyecto</h1>
            <Card className="mb-4">
                <Card.Body>
                    <Card.Title>{proyecto.nombre}</Card.Title>
                    <Card.Text>{proyecto.descripcion}</Card.Text>
                    <p><strong>Fecha de Inicio:</strong> {new Date(proyecto.fechaInicio).toLocaleDateString()}</p>
                    <p><strong>Fecha de Fin:</strong> {new Date(proyecto.fechaFin).toLocaleDateString()}</p>
                    <p><strong>Estado:</strong> {proyecto.estado}</p>
                    <p><strong>Precio:</strong> ${proyecto.precio}</p>
                    <p><strong>Administrador:</strong> {proyecto.administrador?.nombre}</p>
                </Card.Body>
            </Card>

            <h2>Tareas</h2>
            {tareas.map((tarea) => (
                <Card className="mb-3" key={tarea.id}>
                    <Card.Body>
                        <Row>
                            <Col md={1}>
                                <Form.Check
                                    type="checkbox"
                                    checked={tarea.usuarioId !== null} 
                                    onChange={(e) => handleTaskChange(tarea.id, e.target.checked)} 
                                />
                            </Col>
                            <Col md={11}>
                                <Card.Title>{tarea.titulo}</Card.Title>
                                <p><strong>Por:</strong> {tarea.usuarioId !== null ? proyecto.equipo.find((m) => m.id === tarea.usuarioId)?.nombre || "N/A" : "No completada"}</p>
                                <Card.Text>{tarea.descripcion}</Card.Text>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            ))}
            <Button variant="primary" onClick={saveChanges}>Guardar Cambios</Button>

            <h2 className="mt-4">Miembros del Equipo</h2>
            {proyecto.equipo?.map((miembro) => (
                <Card className="mb-3" key={miembro.id}>
                    <Card.Body>
                        <Card.Title>{miembro.nombre}</Card.Title>
                        <p><strong>Email:</strong> {miembro.email}</p>
                    </Card.Body>
                </Card>
            ))}

            <h2 className="mt-4">Inventarios</h2>
            {proyecto.inventarios?.map((item) => (
                <Card className="mb-3" key={item.id}>
                    <Card.Body>
                        <Card.Title>{item.nombre}</Card.Title>
                        <p>{item.descripcion}</p>
                        <p><strong>Precio:</strong> ${item.precio}</p>
                        <p><strong>Cantidad:</strong> {item.cantidad}</p>
                    </Card.Body>
                </Card>
            ))}
        </Container>
        </>
    );
};

export default DetalleProyecto;
