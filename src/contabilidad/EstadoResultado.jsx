import { useEffect, useState } from 'react';
import axios from 'axios';
import MainMenu from '../components/MainMenu';
import './EstadoResultados.css';

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
    <div>
      <MainMenu />
      <div className="estado-resultados" style={{ paddingTop: '20px' }}>
        <div className="seccion">
          <h5>Ingresos</h5>
          {ingresos.map((ingreso) => (
            <div key={ingreso.id} className="fila">
              <span>{ingreso.nombre}</span>
              <span>{ingreso.total.toLocaleString('es-ES')} Bs.</span>
            </div>
          ))}
          <div className="fila total">
            <span>Ganancia Bruta</span>
            <span>{gananciaBruta.toLocaleString('es-ES')} Bs.</span>
          </div>
        </div>

        <div className="seccion">
          <h5>Gastos Operativos</h5>
          {egresos.map((egreso) => (
            <div key={egreso.id} className="fila">
              <span>{egreso.nombre}</span>
              <span>{egreso.total.toLocaleString('es-ES')} Bs.</span>
            </div>
          ))}
          <div className="fila total">
            <span>Total Gastos Operativos</span>
            <span>{totalEgresos.toLocaleString('es-ES')} Bs.</span>
          </div>
        </div>

        <div className="seccion">
          <div className="fila total">
            <h5>Ingreso Operativo</h5>
            <span>{ingresoOperativo.toLocaleString('es-ES')} Bs.</span>
          </div>
        </div>

        <div className="seccion">
          <div className="fila total final">
            <h5>Ingreso Neto</h5>
            <span>{ingresoNeto.toLocaleString('es-ES')} Bs.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadoResultados;
