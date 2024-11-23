import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from './../../components/Header';
import Sidebar from './../../components/SideBar';
const EditProyectosList  = () => {
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
        <div className="main-container">
            <Header title="RavenTech" />
            <div className="content-wrapper">
                <Sidebar />
                <div className="content-area">
                    <Container fluid className="container-dashboard-proyectos">
                        <div className="header-top-container">
                            <h2 className="header-title">Mis Proyectos</h2>
                            <Button className="create-project-button" as={Link} to="/proyecto/formulario">
                                Crear Proyecto
                            </Button>
                        </div>
                        <div className="section-container">
                            <Table responsive className="project-table">
                                <thead>
                                    <tr>
                                        <th style={{textTransform: 'capitalize'}}>Nombre</th>
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
                                            <td style={{textTransform: 'capitalize'}} >{proyecto.nombre}</td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        proyecto.estado === "Pendiente"
                                                            ? "badge-pending"
                                                            : "badge-completed"
                                                    }`}
                                                >
                                                    {proyecto.estado}
                                                </span>
                                            </td>
                                            <td>{new Date(proyecto.fechaInicio).toISOString().split("T")[0]}</td>
                                            <td>{new Date(proyecto.fechaFin).toISOString().split("T")[0]}</td>
                                            <td>
                                                <Button
                                                    className="custom-button"
                                                    as={Link}
                                                    to={`/proyecto/formulario/${proyecto.id}`}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    className="custom-button-secondary"
                                                    onClick={() => deleteProyecto(proyecto.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </td>
                                            <td>
                                                <Button
                                                    className="custom-button"
                                                    as={Link}
                                                    to={`/proyecto/${proyecto.id}/usuarios`}
                                                >
                                                    Ver Usuarios
                                                </Button>
                                            </td>
                                            <td>
                                                <Button
                                                    className="custom-button"
                                                    as={Link}
                                                    to={`/proyecto/${proyecto.id}/tareas`}
                                                >
                                                    Ver Tareas
                                                </Button>
                                            </td>
                                            <td>
                                                <Button
                                                    className="custom-button"
                                                    as={Link}
                                                    to={`/proyecto/${proyecto.id}/inventario`}
                                                >
                                                    Ver Inventario
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Container>
                </div>
            </div>
        </div>
    );
}; 
export default EditProyectosList;
