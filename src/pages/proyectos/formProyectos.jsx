import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row, Container, Form } from "react-bootstrap";
import moment from "moment";
import Sidebar from './../../components/SideBar';
import Header from './../../components/Header';
import './FormProyectos.css';

const FormProyectos = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const userId = localStorage.getItem("id");
    const estado = 'En progreso';
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [precio, setPrecio] = useState('');
    const usuarioId = userId;

    useEffect(() => {
        if (!id) return;
        loadProyecto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadProyecto = () => {
        axios.get(`http://localhost:3000/proyectos/${id}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
        )
            .then((response) => {
                const proyecto = response.data;
                setNombre(proyecto.nombre);
                setDescripcion(proyecto.descripcion);
                setFechaInicio(moment.utc(proyecto.fechaInicio).format("YYYY-MM-DD"));
                setFechaFin(moment.utc(proyecto.fechaFin).format("YYYY-MM-DD"));
                setPrecio(proyecto.precio);
            })
            .catch((error) => {
                console.error("Error al cargar proyecto", error);
            });
    };
    const guardarProyecto = async () => {
        const proyecto = {
            nombre,
            descripcion,
            fechaInicio,
            fechaFin,
            precio,
            estado,
            usuarioId
        };
        if (id) {
            axios.put(`http://localhost:3000/proyectos/${id}`, proyecto)
                .then((response) => {
                    console.log("Proyecto actualizado", response);
                    navigate("/EditMisProyectos");
                })
                .catch((error) => {
                    console.error("Error al actualizar proyecto", error);
                });
        } else {
            axios.post("http://localhost:3000/proyectos", proyecto)
                .then((response) => {
                    console.log("Proyecto creado", response);
                    navigate("/EditMisProyectos");
                })
                .catch((error) => {
                    console.error("Error al crear proyecto", error);
                });
        }
    }
    return ( 
        <div className="main-container">
            <Header title="RavenTech" />
            <div className="content-wrapper">
                <Sidebar />
                <div className="content-area">
                    <Container fluid className="form-container">
                        <h2 className="form-title">{id ? "Editar Proyecto" : "Crear Proyecto"}</h2>
                        <Form className="project-form">
                            <Form.Group controlId="nombre" className="mb-3">
                                <Form.Label className="form-label">Nombre</Form.Label>
                                <Form.Control
                                    className="form-input"
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Ingresa el nombre del proyecto"
                                />
                            </Form.Group>
                            <Form.Group controlId="descripcion" className="mb-3">
                                <Form.Label className="form-label">Descripción</Form.Label>
                                <Form.Control
                                    className="form-input"
                                    as="textarea"
                                    rows={4}
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    placeholder="Describe el proyecto"
                                />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="fechaInicio" className="mb-3">
                                        <Form.Label className="form-label">Fecha de Inicio</Form.Label>
                                        <Form.Control
                                            className="form-input"
                                            type="date"
                                            value={fechaInicio}
                                            onChange={(e) => setFechaInicio(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="fechaFin" className="mb-3">
                                        <Form.Label className="form-label">Fecha de Fin</Form.Label>
                                        <Form.Control
                                            className="form-input"
                                            type="date"
                                            value={fechaFin}
                                            onChange={(e) => setFechaFin(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group controlId="precio" className="mb-3">
                                <Form.Label className="form-label">Precio</Form.Label>
                                <Form.Control
                                    className="form-input"
                                    type="number"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                    placeholder="Ingresa el precio del proyecto"
                                />
                            </Form.Group>
                            <div className="form-actions">
                                <Button
                                    className="custom-button"
                                    onClick={guardarProyecto}
                                >
                                    Guardar
                                </Button>
                                <Button
                                    className="custom-button-secondary"
                                    onClick={() => navigate("/EditMisProyectos")}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </Form>
                    </Container>
                </div>
            </div>
        </div>
    );
};
 
export default FormProyectos;
