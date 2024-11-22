import { useEffect, useState } from "react";
import axios from "axios";
import MainMenu from "../components/MainMenu";
import { useNavigate } from "react-router-dom";

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
    <div>
      <MainMenu />
      <h2>Balance General</h2>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Activos */}
        <div style={{ width: "30%" }}>
          <h3>ACTIVO</h3>
          <table border="1" style={{ width: "100%", textAlign: "left" }}>
            <tbody>
              {activos.map((cuenta, index) => (
                <tr key={index}>
                  <td>{cuenta.nombre}</td>
                  <td style={{ textAlign: "right" }}>
                    {cuenta.total.toLocaleString("es-ES", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              ))}
              <tr>
                <td><strong>Total Activo</strong></td>
                <td style={{ textAlign: "right" }}>
                  <strong>
                    {totalActivo.toLocaleString("es-ES", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    })}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pasivos */}
        <div style={{ width: "30%" }}>
          <h3>PASIVO</h3>
          <table border="1" style={{ width: "100%", textAlign: "left" }}>
            <tbody>
              {pasivos.map((cuenta, index) => (
                <tr key={index}>
                  <td>{cuenta.nombre}</td>
                  <td style={{ textAlign: "right" }}>
                    {cuenta.total.toLocaleString("es-ES", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              ))}
              <tr>
                <td><strong>Total Pasivo</strong></td>
                <td style={{ textAlign: "right" }}>
                  <strong>
                    {totalPasivo.toLocaleString("es-ES", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    })}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Patrimonio */}
          <h3>PATRIMONIO</h3>
          <table border="1" style={{ width: "100%", textAlign: "left" }}>
            <tbody>
              {patrimonio && patrimonio.nombre !== "Resultado del Ejercicio" && (
                <tr>
                  <td>{patrimonio.nombre}</td>
                  <td style={{ textAlign: "right" }}>
                    {patrimonio.total.toLocaleString("es-ES", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              )}
              <tr>
                <td>Resultado del Ejercicio</td>
                <td style={{ textAlign: "right" }}>
                  {resultadoEjercicio.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  })}
                </td>
              </tr>
              <tr>
                <td><strong>Total Patrimonio</strong></td>
                <td style={{ textAlign: "right" }}>
                  <strong>
                    {totalPatrimonio.toLocaleString("es-ES", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    })}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Suma total */}
      <div style={{ marginTop: "20px" }}>
        <table border="1" style={{ width: "100%", textAlign: "left" }}>
          <tbody>
            <tr>
              <td><strong>Suma Activo</strong></td>
              <td style={{ textAlign: "right" }}>
                {totalActivo.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                })}
              </td>
            </tr>
            <tr>
              <td><strong>Pasivo + Patrimonio</strong></td>
              <td style={{ textAlign: "right" }}>
                {(totalPasivo + totalPatrimonio).toLocaleString("es-ES", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BalanceGeneral;
