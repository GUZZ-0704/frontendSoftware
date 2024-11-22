import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import MainMenu from "../components/MainMenu";
const ListaMisProyectos = () => {
    const id = localStorage.getItem("id");
    const [proyectos, setProyectos] = useState([]);

    useEffect(() => {
        loadProyectos();
        document.title = "Mis Proyectos";
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadProyectos = () => {
        axios.get(`http://localhost:3000/proyectos/admin/${id}`)
            .then((response) => {
                setProyectos(response.data);
            })
            .catch((error) => {
                console.error("Error al cargar proyectos", error);
            });
    }

    const deleteProyecto = async (id) => {
        const confirm = window.confirm("¿Estás seguro de que querés borrar este proyecto?");
        if (!confirm) return;

        axios.delete(`http://localhost:3000/proyectos/${id}`)
            .then((response) => {
                console.log("Proyecto eliminado", response);
                loadProyectos();
            })
            .catch((error) => {
                console.error("Error al eliminar proyecto", error);
            });
    };

    return (
        <>
            <MainMenu />
            <Container className="mt-5">
                <Row>
                    <Col md={12}>
                        <h2>Mis Proyectos</h2>
                        <Button variant="primary" as={Link} to="/proyecto/formulario">Crear Proyecto</Button>
                        {/* TODO: Agregar tabla con los proyectos */}
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Estado</th>
                                    <th>Fecha de Inicio</th>
                                    <th>Fecha de Fin</th>
                                    <th>Acciones</th>
                                    <th>Usuarios</th>
                                    <th>Tareas</th>
                                    <th>Inventario</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proyectos.map((proyecto) => (
                                    <tr key={proyecto.id}>
                                        <td>{proyecto.nombre}</td>
                                        <td>{proyecto.estado}</td>
                                        <td>{new Date(proyecto.fechaInicio).toISOString().split('T')[0]}</td>
                                        <td>{new Date(proyecto.fechaFin).toISOString().split('T')[0]}</td>
                                        <td>
                                            <Button variant="primary" as={Link} to={`/proyecto/formulario/${proyecto.id}`}>Editar</Button>
                                            <Button variant="danger" onClick={() => deleteProyecto(proyecto.id)}>Eliminar</Button>
                                        </td>
                                        <td>
                                            <Button variant="primary" as={Link} to={`/proyecto/${proyecto.id}/usuarios`}>Ver Usuarios</Button>
                                        </td>
                                        <td>
                                            <Button variant="primary" as={Link} to={`/proyecto/${proyecto.id}/tareas`}>Ver Tareas</Button>
                                        </td>
                                        <td>
                                            <Button variant="primary" as={Link} to={`/proyecto/${proyecto.id}/inventario`}>Ver Inventario</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
     );
}
 
export default ListaMisProyectos;
