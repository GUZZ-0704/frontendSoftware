import { useEffect, useState } from 'react';
import axios from 'axios';
import './EstadoResultados.css';
import { Col } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import Sidebar from './../../components/SideBar';
import Header from './../../components/Header';

const EstadoResultados = () => {
  const [ingresos, setIngresos] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/cuentas/estadoResultados/lista', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIngresos(response.data.Ingreso);
        setEgresos(response.data.Egreso);
      } catch (error) {
        console.error('Error al obtener las cuentas: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCuentas();
  }, [token]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  const totalIngresos = ingresos.reduce((acc, ingreso) => acc + ingreso.total, 0);
  const totalEgresos = egresos.reduce((acc, egreso) => acc + egreso.total, 0);
  const gananciaBruta = totalIngresos;
  const ingresoOperativo = gananciaBruta - totalEgresos;
  const ingresoNeto = ingresoOperativo;

  return (
    <div className="main-container">
    <Header title="RavenTech - Estado de Resultados" />
    <div className="content-wrapper">
      <Sidebar />
      <div className="content-area">
        <Container fluid className="estado-resultados-container">
          <h2 className="estado-resultados-title">Estado de Resultados</h2>

          {/* Ingresos */}
          <Row>
            <Col lg={12} className="estado-seccion">
              <h5 className="seccion-title">Ingresos</h5>
              {ingresos.map((ingreso) => (
                <div key={ingreso.id} className="fila">
                  <span>{ingreso.nombre}</span>
                  <span className="text-end">{ingreso.total.toLocaleString('es-ES')} Bs.</span>
                </div>
              ))}
              <div className="fila total">
                <span>Ganancia Bruta</span>
                <span className="text-end">{gananciaBruta.toLocaleString('es-ES')} Bs.</span>
              </div>
            </Col>
          </Row>

          {/* Gastos Operativos */}
          <Row>
            <Col lg={12} className="estado-seccion">
              <h5 className="seccion-title">Gastos Operativos</h5>
              {egresos.map((egreso) => (
                <div key={egreso.id} className="fila">
                  <span>{egreso.nombre}</span>
                  <span className="text-end">{egreso.total.toLocaleString('es-ES')} Bs.</span>
                </div>
              ))}
              <div className="fila total">
                <span>Total Gastos Operativos</span>
                <span className="text-end">{totalEgresos.toLocaleString('es-ES')} Bs.</span>
              </div>
            </Col>
          </Row>

          {/* Ingreso Operativo */}
          <Row>
            <Col lg={12} className="estado-seccion">
              <div className="fila total">
                <h5>Ingreso Operativo</h5>
                <span className="text-end">{ingresoOperativo.toLocaleString('es-ES')} Bs.</span>
              </div>
            </Col>
          </Row>

          {/* Ingreso Neto */}
          <Row>
            <Col lg={12} className="estado-seccion">
              <div className="fila total final">
                <h5>Ingreso Neto</h5>
                <span className="text-end">{ingresoNeto.toLocaleString('es-ES')} Bs.</span>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  </div>
);
};
export default EstadoResultados;
