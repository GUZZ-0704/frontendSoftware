import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Table } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import Sidebar from './../../components/SideBar';
import Header from './../../components/Header';
import './BalanceGeneral.css';

const BalanceGeneral = () => {
  const navigate = useNavigate();
  const [cuentas, setCuentas] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/cuentas/balanceGeneral/lista",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCuentas(response.data);
      } catch (error) {
        console.error("Error al obtener las cuentas: ", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCuentas();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  // Inicializar los totales
  let totalActivo = 0;
  let totalPasivo = 0;
  let totalPatrimonio = 0;
  let resultadoEjercicio = 0;

  // Filtrar y calcular los totales
  const activos = cuentas["Activo"] || [];
  const pasivos = cuentas["Pasivo"] || [];
  const patrimonio = cuentas["Patrimonio"];

  activos.forEach((cuenta) => {
    totalActivo += cuenta.total;
  });

  pasivos.forEach((cuenta) => {
    totalPasivo += cuenta.total;
  });

  // Manejar el valor de Patrimonio
  if (patrimonio) {
    if (patrimonio.nombre === "Resultado del Ejercicio") {
      resultadoEjercicio = patrimonio.total;
    } else {
      totalPatrimonio += patrimonio.total;
    }
  }

  // Sumar el resultado del ejercicio al patrimonio total
  totalPatrimonio += resultadoEjercicio;

  return (
    <div className="main-container">
      <Header title="RavenTech" />
      <div className="content-wrapper">
        <Sidebar />
        <div className="content-area">
        <Container fluid className="balance-container">
          <h2 className="balance-title">Balance General</h2>
          <Row className="balance-rows">
            {/* Columna Activo */}
            <Col className="balance-column">
              <h3 className="balance-section-title">ACTIVO</h3>
              <Table className="balance-table">
                <tbody>
                  {activos.map((cuenta, index) => (
                    <tr key={index}>
                      <td>{cuenta.nombre}</td>
                      <td className="text-end">
                        {cuenta.total.toLocaleString("es-ES", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td><strong>Total Activo</strong></td>
                    <td className="text-end">
                      <strong>
                        {totalActivo.toLocaleString("es-ES", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>

            {/* Columna Pasivo */}
            <Col className="balance-column">
              <h3 className="balance-section-title">PASIVO</h3>
              <Table className="balance-table">
                <tbody>
                  {pasivos.map((cuenta, index) => (
                    <tr key={index}>
                      <td>{cuenta.nombre}</td>
                      <td className="text-end">
                        {cuenta.total.toLocaleString("es-ES", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td><strong>Total Pasivo</strong></td>
                    <td className="text-end">
                      <strong>
                        {totalPasivo.toLocaleString("es-ES", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </Table>

              <h3 className="balance-section-title">PATRIMONIO</h3>
              <Table className="balance-table">
                <tbody>
                  <tr>
                    <td>Patrimonio social</td>
                    <td className="text-end">
                      {patrimonio.total.toLocaleString("es-ES", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>Resultado del Ejercicio</td>
                    <td className="text-end">
                      {resultadoEjercicio.toLocaleString("es-ES", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Total Patrimonio</strong></td>
                    <td className="text-end">
                      <strong>
                        {totalPatrimonio.toLocaleString("es-ES", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>

          {/* Resultados Totales Alineados */}
          <Row className="balance-totals-row">
            <Col className="balance-column text-center">
              <Table className="balance-total-table">
                <tbody>
                  <tr>
                    <td><strong>Suma Activo</strong></td>
                    <td className="text-end">
                      {totalActivo.toLocaleString("es-ES", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col className="balance-column text-center">
              <Table className="balance-total-table">
                <tbody>
                  <tr>
                    <td><strong>Pasivo + Patrimonio</strong></td>
                    <td className="text-end">
                      {(totalPasivo + totalPatrimonio).toLocaleString("es-ES", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>

        </div>
      </div>
    </div>
  );
};

export default BalanceGeneral;
