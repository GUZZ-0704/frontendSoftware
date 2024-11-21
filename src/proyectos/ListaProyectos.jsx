import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import MainMenu from "../components/MainMenu";

const ListaProyectos = () => {
    const id = localStorage.getItem("id");
    const [proyectosAdministrados, setProyectosAdministrados] = useState([]);
    const [proyectosParticipados, setProyectosParticipados] = useState([]);

    useEffect(() => {
        loadProyectos();
        document.title = "Proyectos";
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadProyectos = () => {
        axios.get(`http://localhost:3000/proyectos/admin/${id}`)
            .then((response) => {
                setProyectosAdministrados(response.data);
            })
            .catch((error) => {
                console.error("Error al cargar proyectos administrados", error);
            });

        axios.get(`http://localhost:3000/proyectos/usuario/${id}`)
            .then((response) => {
                setProyectosParticipados(response.data);
            })
            .catch((error) => {
                console.error("Error al cargar proyectos participados", error);
            });
    };

    const renderProyectoCard = (proyecto) => (
        <Card key={proyecto.id} className="mb-4">
            <Card.Body>
                <Card.Title>{proyecto.nombre}</Card.Title>
                <Card.Text>
                    <strong>Estado:</strong> {proyecto.estado} <br />
                    <strong>Fecha de Inicio:</strong> {new Date(proyecto.fechaInicio).toLocaleDateString()} <br />
                    <strong>Fecha de Fin:</strong> {new Date(proyecto.fechaFin).toLocaleDateString()}
                </Card.Text>
                <Button variant="primary" as={Link} to={`/proyecto/${proyecto.id}`}>
                    Ver Detalles
                </Button>
            </Card.Body>
        </Card>
    );

    return (
        <>
            <MainMenu />
            <Container className="mt-5">
                <Row>
                    <Col md={6}>
                        <h2>Proyectos Administrados</h2>
                        {proyectosAdministrados.length > 0 ? (
                            proyectosAdministrados.map(renderProyectoCard)
                        ) : (
                            <p>No tienes proyectos administrados.</p>
                        )}
                    </Col>
                    <Col md={6}>
                        <h2>Proyectos Donde Participas</h2>
                        {proyectosParticipados.length > 0 ? (
                            proyectosParticipados.map(renderProyectoCard)
                        ) : (
                            <p>No participas en ningún proyecto.</p>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ListaProyectos;
