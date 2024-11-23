import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FlujoEfectivo.css";
import Header from "./../../components/Header";
import Sidebar from "./../../components/SideBar";

const FlujoEfectivo = () => {
  const navigate = useNavigate();
  const [cuentas, setCuentas] = useState({ Ingreso: [], Egreso: [] });
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [years, setYears] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/cuentas/flujoEfectivo/lista",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCuentas(response.data); // Guardar las cuentas en el estado
        const anios = Object.keys(
          response.data.Ingreso.reduce((acc, cuenta) => {
            Object.keys(cuenta.totalPorMes).forEach((year) => {
              acc[year] = true;
            });
            return acc;
          }, {})
        );
        setYears(anios);
        setSelectedYear(anios[0] || "");
      } catch (error) {
        console.error("Error al obtener las cuentas: ", error);
        if (error.status === 401) {
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

  // Crear una lista de meses
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  // Crear una estructura para almacenar los totales de ingresos, egresos y flujo de efectivo
  const flujoEfectivo = {};

  // Iterar sobre los ingresos y egresos para llenar la estructura
  cuentas.Ingreso.forEach((cuenta) => {
    Object.entries(cuenta.totalPorMes).forEach(([anio, mesesData]) => {
      Object.entries(mesesData).forEach(([mes, total]) => {
        if (!flujoEfectivo[anio]) flujoEfectivo[anio] = {};
        if (!flujoEfectivo[anio][mes])
          flujoEfectivo[anio][mes] = { ingreso: 0, egreso: 0 };
        flujoEfectivo[anio][mes].ingreso += total;
      });
    });
  });

  cuentas.Egreso.forEach((cuenta) => {
    Object.entries(cuenta.totalPorMes).forEach(([anio, mesesData]) => {
      Object.entries(mesesData).forEach(([mes, total]) => {
        if (!flujoEfectivo[anio]) flujoEfectivo[anio] = {};
        if (!flujoEfectivo[anio][mes])
          flujoEfectivo[anio][mes] = { ingreso: 0, egreso: 0 };
        flujoEfectivo[anio][mes].egreso += total;
      });
    });
  });

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div className="main-container">
      <Header title="RavenTech - Flujo de Efectivo" />
      <div className="content-wrapper">
        <Sidebar />
        <div className="content-area">
          <div className="flujo-efectivo-container">
            <h1 className="flujo-efectivo-title">Flujo de Efectivo</h1>
            <label htmlFor="yearSelector" className="filter-label">
              Seleccione un año:
            </label>
            <select
              id="yearSelector"
              value={selectedYear}
              onChange={handleYearChange}
              className="filter-select"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {selectedYear && (
              <div className="flujo-efectivo-section">
                <table className="flujo-efectivo-table">
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      {meses.map((mes, index) =>
                        flujoEfectivo[selectedYear][
                          String(index + 1).padStart(2, "0")
                        ] ? (
                          <th key={index}>{mes}</th>
                        ) : <th key={index}>{mes}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        colSpan={meses.length + 1}
                        className="table-section-title"
                      >
                        Ingresos
                      </td>
                    </tr>
                    {cuentas.Ingreso.map((cuenta, index) => (
                      <tr key={`ingreso-${index}`}>
                        <td>{cuenta.nombre}</td>
                        {meses.map((_, mesIndex) => {
                          const mesKey = String(mesIndex + 1).padStart(2, "0");
                          const total =
                            flujoEfectivo[selectedYear][mesKey]?.ingreso || 0;
                            console.log(cuenta);
                          return <td key={mesIndex}>{total.toFixed(2)}</td>;
                        })}
                      </tr>
                    ))}
                    <tr>
                      <td
                        colSpan={meses.length + 1}
                        className="table-section-title"
                      >
                        Egresos
                      </td>
                    </tr>
                    {cuentas.Egreso.map((cuenta, index) => (
                      <tr key={`egreso-${index}`}>
                        <td>{cuenta.nombre}</td>
                        {meses.map((_, mesIndex) => {
                          const mesKey = String(mesIndex + 1).padStart(2, "0");
                          const total =
                            flujoEfectivo[selectedYear][mesKey]?.egreso || 0;
                          return <td key={mesIndex}>{total.toFixed(2)}</td>;
                        })}
                      </tr>
                    ))}
                    <tr>
                      <td>Flujo de Efectivo</td>
                      {meses.map((_, index) => {
                        const mesIndex = String(index + 1).padStart(2, "0");
                        const ingreso =
                          flujoEfectivo[selectedYear][mesIndex]?.ingreso || 0;
                        const egreso =
                          flujoEfectivo[selectedYear][mesIndex]?.egreso || 0;
                        return (
                          <td key={index}>{(ingreso - egreso).toFixed(2)}</td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td>Flujo de Efectivo Acumulado</td>
                      {meses.map((_, index) => {
                        let flujoAcumulado = 0;
                        for (let i = 0; i <= index; i++) {
                          const mesIndex = String(i + 1).padStart(2, "0");
                          if (flujoEfectivo[selectedYear][mesIndex]) {
                            const ingreso =
                              flujoEfectivo[selectedYear][mesIndex]?.ingreso ||
                              0;
                            const egreso =
                              flujoEfectivo[selectedYear][mesIndex]?.egreso ||
                              0;
                            flujoAcumulado += ingreso - egreso;
                          }
                        }
                        return flujoEfectivo[selectedYear][
                          String(index + 1).padStart(2, "0")
                        ] ? (
                          <td key={index}>{flujoAcumulado.toFixed(2)}</td>
                        ) : <td>0.00</td>;
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FlujoEfectivo;
