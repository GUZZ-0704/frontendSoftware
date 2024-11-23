import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PlanDeCuenta.css";
import Header from './../../components/Header';
import Sidebar from './../../components/SideBar';
import './LibroDiario.css';

const LibroDiario = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const [anio, setAnio] = useState(2024);
  const [mes, setMes] = useState(11);
  const [librosDiarios, setLibrosDiarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const [overlay, setOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState(""); // "libro", "transaccion", "detalle"
  const [currentData, setCurrentData] = useState(null); // Data being edited/added
  const [cuentas, setCuentas] = useState([]);

  useEffect(() => {
    fetchLibrosDiarios();
    fetchCuentas();
  }, [anio, mes]);

  const fetchCuentas = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/cuentas/finales/lista",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCuentas(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const fetchLibrosDiarios = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/librosDiarios/anio/${anio}/mes/${mes}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLibrosDiarios(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleAnioChange = (e) => setAnio(e.target.value);
  const handleMesChange = (e) => setMes(e.target.value);

  const openOverlay = (type, data = null) => {
    setOverlayType(type);
    setCurrentData(data || {});
    setOverlay(true);
  };

  const closeOverlay = () => {
    setOverlay(false);
    setOverlayType("");
    setCurrentData(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentData({ ...currentData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const url =
        overlayType === "libro"
          ? `http://localhost:3000/librosDiarios`
          : overlayType === "transaccion"
          ? `http://localhost:3000/transacciones`
          : `http://localhost:3000/detalleTransacciones`;

      const method = currentData.id ? "put" : "post";
      const response = await axios({
        method,
        url: currentData.id ? `${url}/${currentData.id}` : url,
        headers: { Authorization: `Bearer ${token}` },
        data: currentData,
      });

      console.log("Data saved:", response.data);
      fetchLibrosDiarios();
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      closeOverlay();
    }
  };

  const handleDelete = async (type, id) => {
    const url =
      type === "libro"
        ? `http://localhost:3000/librosDiarios`
        : type === "transaccion"
        ? `http://localhost:3000/transacciones`
        : `http://localhost:3000/detalleTransacciones`;

    try {
      await axios.delete(`${url}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLibrosDiarios();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
<div className="main-container">
        <Header title="RavenTech - Libro Diario" />
        <div className="content-wrapper">
            <Sidebar />
            <div className="content-area">
                <div className="libro-diario-container">
                    <h1 className="libro-diario-title">Libro Diario</h1>

                    <div className="filters-container">
                        <div className="filter">
                            <label className="filter-label">Seleccionar Año:</label>
                            <select
                                className="filter-select"
                                value={anio}
                                onChange={handleAnioChange}
                            >
                                {Array.from({ length: 10 }, (_, i) => (
                                    <option key={2020 + i} value={2020 + i}>
                                        {2020 + i}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="filter">
                            <label className="filter-label">Seleccionar Mes:</label>
                            <select
                                className="filter-select"
                                value={mes}
                                onChange={handleMesChange}
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        className="custom-button mt-4"
                        onClick={() => openOverlay("libro")}
                    >
                        Agregar Libro Diario
                    </button>
                    <br />
                    <br />

                    {loading ? (
                        <p className="loading-text">Cargando...</p>
                    ) : librosDiarios.length === 0 ? (
                        <div className="alert alert-info mt-4">
                            No hay libros diarios para el mes y año seleccionados.
                        </div>
                    ) : (
                        librosDiarios.map((libro) => (
                            <div key={libro.id} className="libro-card">
                                <div className="libro-card-header">
                                    <h5 className="libro-card-title">
                                        {(() => {
                                            const fecha = new Date(libro.fecha);
                                            fecha.setDate(fecha.getDate() + 1);
                                            return fecha.toLocaleDateString("es-ES", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                            });
                                        })()}
                                    </h5>
                                    <p className="libro-description">{libro.descripcion}</p>
                                    <div className="libro-card-actions">
                                        <button
                                            className="custom-button"
                                            onClick={() =>
                                                openOverlay("transaccion", {
                                                    libroDiarioId: libro.id,
                                                })
                                            }
                                        >
                                            Agregar Transacción
                                        </button>
                                        <button
                                            className="custom-button-libro"
                                            onClick={() => openOverlay("libro", libro)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="custom-button-danger"
                                            onClick={() => handleDelete("libro", libro.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>

                                <div className="libro-card-body">
                                  {libro.transacciones.map((transaccion) => (
                                      <div key={transaccion.id} className="transaccion-card">
                                          <div className="transaccion-header">
                                              <h6 className="transaccion-title">{transaccion.descripcion}</h6>
                                              <div className="transaccion-actions">
                                                  <button
                                                      className="custom-button-libro"
                                                      onClick={() => {
                                                          openOverlay("detalle");
                                                          setCurrentData({
                                                              ...currentData,
                                                              transaccionesId: transaccion.id,
                                                              libroDiarioId: libro.id,
                                                          });
                                                      }}
                                                  >
                                                      Agregar Detalle
                                                  </button>
                                                  <button
                                                      className="custom-button-libro"
                                                      onClick={() => openOverlay("transaccion", transaccion)}
                                                  >
                                                      Editar
                                                  </button>
                                                  <button
                                                      className="custom-button-danger"
                                                      onClick={() =>
                                                          handleDelete("transaccion", transaccion.id)
                                                      }
                                                  >
                                                      Eliminar
                                                  </button>
                                              </div>
                                          </div>
                                          <div className="transaccion-detalle">
                                              {libro.detallesTransacciones.filter(
                                                  (detalle) => detalle.transaccionesId === transaccion.id
                                              ).length === 0 ? (
                                                  <div className="alert alert-info">
                                                      No hay detalles registrados para esta transacción.
                                                  </div>
                                              ) : (
                                                  <table className="transacciones-table">
                                                      <thead>
                                                          <tr>
                                                              <th>Cuenta</th>
                                                              <th style={{width: '200px'}}>Debe</th>
                                                              <th style={{width: '200px'}}>Haber</th>
                                                              <th style={{width: '80px'}}>Acciones</th>
                                                          </tr>
                                                      </thead>
                                                      <tbody>
                                                          {libro.detallesTransacciones
                                                              .filter(
                                                                  (detalle) =>
                                                                      detalle.transaccionesId ===
                                                                      transaccion.id
                                                              )
                                                              .map((detalle) => (
                                                                  <tr key={detalle.id}>
                                                                      <td>{detalle.cuenta?.nombre}</td>
                                                                      <td>{detalle.debe.toFixed(2)}</td>
                                                                      <td>{detalle.haber.toFixed(2)}</td>
                                                                      <td className="acciones-libro">
                                                                          <button
                                                                              className="custom-button-libro"
                                                                              onClick={() =>
                                                                                  openOverlay(
                                                                                      "detalle",
                                                                                      detalle
                                                                                  )
                                                                              }
                                                                          >
                                                                              <i className="bi bi-pencil-fill"></i>
                                                                          </button>
                                                                          <button
                                                                              className="custom-button-danger"
                                                                              onClick={() =>
                                                                                  handleDelete(
                                                                                      "detalle",
                                                                                      detalle.id
                                                                                  )
                                                                              }
                                                                          >
                                                                              <i className="bi bi-trash-fill"></i>
                                                                          </button>
                                                                      </td>
                                                                  </tr>
                                                              ))}
                                                      </tbody>
                                                  </table>
                                              )}
                                          </div>
                                      </div>
                                  ))}
                              </div>


                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
            {overlay && (
            <div className="modal-overlay">
                <div className="modal-wrapper">
                    <div className="modal-content">
                        <h4 className="modal-title">
                            {currentData?.id ? "Editar" : "Agregar"} {overlayType}
                        </h4>
                        <form>
                            {overlayType !== "detalle" ? (
                                <div className="form-group">
                                    <label>Descripción:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="descripcion"
                                        value={currentData?.descripcion || ""}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label>Cuenta:</label>
                                    <select
                                        className="form-select"
                                        name="cuentaId"
                                        value={currentData?.cuentaId || ""}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Selecciona una cuenta</option>
                                        {cuentas.map((cuenta) => (
                                            <option key={cuenta.id} value={cuenta.id}>
                                                {cuenta.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <label>Debe:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="debe"
                                        value={currentData?.debe || ""}
                                        onChange={handleInputChange}
                                    />
                                    <label>Haber:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="haber"
                                        value={currentData?.haber || ""}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            )}
                            {overlayType === "libro" && (
                                <div className="form-group">
                                    <label>Fecha:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="fecha"
                                        value={
                                            currentData?.fecha
                                                ? new Date(currentData.fecha)
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        }
                                        onChange={handleInputChange}
                                    />
                                </div>
                            )}
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="custom-button"
                                    onClick={handleSave}
                                >
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    className="custom-button-secondary"
                                    onClick={closeOverlay}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
          )}
        </div>
    );
};



export default LibroDiario;
