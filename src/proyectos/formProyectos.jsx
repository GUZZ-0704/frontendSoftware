import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row, Container, Form } from "react-bootstrap";
import moment from "moment";
import MainMenu from '../components/MainMenu';

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
        axios.get(`http://localhost:3000/proyectos/${id}`)
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
        <>
            <MainMenu />
            <Container className="mt-5">
                <Row>
                    <Col md={6}>
                        <h2>Formulario de Proyectos</h2>
                        <Form>
                            <Form.Group controlId="nombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="descripcion">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="fechaInicio">
                                <Form.Label>Fecha de Inicio</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="fechaFin">
                                <Form.Label>Fecha de Fin</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="precio">
                                <Form.Label>Precio</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={guardarProyecto}>
                                Guardar
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
     );
}
 
export default FormProyectos;
