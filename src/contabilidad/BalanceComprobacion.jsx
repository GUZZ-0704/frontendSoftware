import { useEffect, useState } from "react";
import axios from "axios";
import MainMenu from "../components/MainMenu";
import { useNavigate } from "react-router-dom";

const BalanceComprobacion = () => {
  const navigate = useNavigate();
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/cuentas/balanceComprobacion/lista",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCuentas(response.data); // Guardar las cuentas en el estado
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

  const rows = [];
  let totalDebe = 0;
  let totalHaber = 0;
  let totalSaldoHaber = 0;
  let totalSaldoDebe = 0;
  let totalPatrimonialHaber = 0;
  let totalPatrimonialDebe = 0;
  let totalResultadoHaber = 0;
  let totalResultadoDebe = 0;
  let resultadoPatrimonial = 0;
  let resultadoResultado = 0;
  let totalesPatrimonialDebe = 0;
  let totalesPatrimonialHaber = 0;
  let totalesResultadoDebe = 0;
  let totalesResultadoHaber = 0;

  Object.keys(cuentas).forEach((tipo) => {
    cuentas[tipo].forEach((cuenta) => {
      var saldoDebe = 0;
      var saldoHaber = 0;
      // Calcular saldos
      if (cuenta.totalDebe > cuenta.totalHaber) {
        saldoDebe = cuenta.totalDebe - cuenta.totalHaber;
        saldoHaber = 0;
      } else if (cuenta.totalHaber > cuenta.totalDebe) {
        saldoDebe = 0;
        saldoHaber = cuenta.totalHaber - cuenta.totalDebe;
      }
      var patrimonialDebe = 0;
      var patrimonialHaber = 0;
      //calcular patriomonial
      if (cuenta.tipo === "Patrimonial") {
        patrimonialDebe = saldoDebe;
        patrimonialHaber = saldoHaber;
      } else if (cuenta.tipo === "Activo") {
        patrimonialDebe = saldoDebe;
        patrimonialHaber = saldoHaber;
      } else if (cuenta.tipo === "Pasivo") {
        patrimonialDebe = saldoDebe;
        patrimonialHaber = saldoHaber;
      }

      var resultadoDebe = 0;
      var resultadoHaber = 0;
      //calcular restultados
      if (cuenta.tipo === "Ingreso") {
        resultadoDebe = saldoDebe;
        resultadoHaber = saldoHaber;
      }
      if (cuenta.tipo === "Egreso") {
        resultadoDebe = saldoDebe;
        resultadoHaber = saldoHaber;
      }

      rows.push({
        codigo: cuenta.codigo,
        nombre: cuenta.nombre,
        tipo: cuenta.tipo,
        sumaDebe: cuenta.totalDebe,
        sumaHaber: cuenta.totalHaber,
        saldoDebe: saldoDebe,
        saldoHaber: saldoHaber,
        patrimonialDebe: patrimonialDebe,
        patrimonialHaber: patrimonialHaber,
        resultadoDebe: resultadoDebe,
        resultadoHaber: resultadoHaber,
      });
      totalDebe += cuenta.totalDebe;
      totalHaber += cuenta.totalHaber;
      totalSaldoDebe += saldoDebe;
      totalSaldoHaber += saldoHaber;
      totalPatrimonialDebe += patrimonialDebe;
      totalPatrimonialHaber += patrimonialHaber;
      totalResultadoDebe += resultadoDebe;
      totalResultadoHaber += resultadoHaber;
    });

    resultadoPatrimonial = totalPatrimonialDebe - totalPatrimonialHaber;
    resultadoResultado = totalResultadoDebe - totalResultadoHaber;
    //make positive
    if (resultadoPatrimonial < 0) {
      resultadoPatrimonial = resultadoPatrimonial * -1;
    }
    if (resultadoResultado < 0) {
      resultadoResultado = resultadoResultado * -1;
    }

    if (totalPatrimonialDebe > totalPatrimonialHaber) {
      totalesPatrimonialDebe = totalPatrimonialDebe;
      totalesPatrimonialHaber = totalPatrimonialHaber + resultadoPatrimonial;
    } else {
      totalesPatrimonialDebe = totalPatrimonialDebe + resultadoPatrimonial;
      totalesPatrimonialHaber = totalPatrimonialHaber;
    }

    if (totalResultadoDebe > totalResultadoHaber) {
      totalesResultadoDebe = totalResultadoDebe;
      totalesResultadoHaber = totalResultadoHaber + resultadoResultado;
    } else {
      totalesResultadoDebe = totalResultadoDebe + resultadoResultado;
      totalesResultadoHaber = totalResultadoHaber;
    }
  });

  return (
    <div>
      <MainMenu />
      <h2>Balance de Comprobación de Sumas y Saldos</h2>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th rowSpan={2}>Nombre</th>
            <th colSpan={2}>Sumas</th>
            <th colSpan={2}>Saldos</th>
            <th colSpan={2}>CTAS. Patrimoniales</th>
            <th colSpan={2}>CTAS. Resultados</th>
          </tr>
          <tr>
            <th>Haber</th>
            <th>Debe</th>
            <th>Haber</th>
            <th>Debe</th>
            <th>Haber</th>
            <th>Debe</th>
            <th>Haber</th>
            <th>Debe</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.nombre}</td>
              <td>{row.sumaDebe.toFixed(2)}</td>
              <td>{row.sumaHaber.toFixed(2)}</td>
              <td>{row.saldoDebe.toFixed(2)}</td>
              <td>{row.saldoHaber.toFixed(2)}</td>
              <td>{row.patrimonialDebe.toFixed(2)}</td>
              <td>{row.patrimonialHaber.toFixed(2)}</td>
              <td>{row.resultadoDebe.toFixed(2)}</td>
              <td>{row.resultadoHaber.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <strong>Totales</strong>
            </td>
            <td>
              <strong>{totalDebe.toFixed(2)}</strong>
            </td>
            <td>
              <strong>{totalHaber.toFixed(2)}</strong>
            </td>
            <td>
              <strong>{totalSaldoDebe.toFixed(2)}</strong>
            </td>
            <td>
              <strong>{totalSaldoHaber.toFixed(2)}</strong>
            </td>
            <td>
              <strong>{totalPatrimonialDebe.toFixed(2)}</strong>
            </td>
            <td>
              <strong>{totalPatrimonialHaber.toFixed(2)}</strong>
            </td>
            <td>
              <strong>{totalResultadoDebe.toFixed(2)}</strong>
            </td>
            <td>
              <strong>{totalResultadoHaber.toFixed(2)}</strong>
            </td>
          </tr>
          <tr>
            <td>
              <strong>Resultado del ejercicio</strong>
            </td>
            <td colSpan={5}></td>
            <td>{resultadoPatrimonial.toFixed(2)}</td>
            <td>{resultadoResultado.toFixed(2)}</td>
          </tr>
          <tr>
            <strong>Totales</strong>
            <td colSpan={4}></td>
            <td>{totalesPatrimonialDebe.toFixed(2)}</td>
            <td>{totalesPatrimonialHaber.toFixed(2)}</td>
            <td>{totalesResultadoDebe.toFixed(2)}</td>
            <td>{totalesResultadoHaber.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default BalanceComprobacion;
