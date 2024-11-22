import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainMenu from "../components/MainMenu";
import "./PlanDeCuenta.css";

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
    <>
      <MainMenu />
      <div className="container">
        <h1 className="mt-4">Libro Diario</h1>

        <div className="mb-4">
          <label className="form-label">Seleccionar Año:</label>
          <select
            className="form-select"
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

        <div className="mb-4">
          <label className="form-label">Seleccionar Mes:</label>
          <select
            className="form-select"
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

        <button
          className="btn btn-primary mb-2"
          onClick={() => openOverlay("libro")}
        >
          Agregar Libro Diario
        </button>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          librosDiarios.map((libro) => (
            <div key={libro.id} className="card mb-3">
              <div className="card-header">
                <h5>
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
                <p>{libro.descripcion}</p>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    openOverlay("transaccion", { libroDiarioId: libro.id })
                  }
                >
                  Agregar Transaccion
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => openOverlay("libro", libro)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete("libro", libro.id)}
                >
                  Eliminar
                </button>
              </div>
              {/* Transacciones */}
              <div className="card-body">
                {libro.transacciones.map((transaccion) => (
                  <div key={transaccion.id}>
                    <div>
                      <h6>{transaccion.descripcion}</h6>
                      <button
                        className="btn btn-primary"
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
                        className="btn btn-warning"
                        onClick={() => openOverlay("transaccion", transaccion)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          handleDelete("transaccion", transaccion.id)
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                    {/* detalle transacciones */}
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Cuenta</th>
                          <th>Debe</th>
                          <th>Haber</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {libro.detallesTransacciones
                          .filter(
                            (detalle) =>
                              detalle.transaccionesId === transaccion.id
                          )
                          .map((detalle) => (
                            <tr key={detalle.id}>
                              <td>{detalle.cuenta?.nombre}</td>
                              <td>{detalle.debe.toFixed(2)}</td>
                              <td>{detalle.haber.toFixed(2)}</td>
                              <td>
                                <button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    openOverlay("detalle", detalle)
                                  }
                                >
                                  Editar
                                </button>
                                <button className="btn btn-danger">
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {overlay && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>
              {currentData?.id ? "Editar" : "Agregar"} {overlayType}
            </h4>
            <form>
              {overlayType !== "detalle" ? (
                <div className="mb-3">
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
                <div className="mb-3">
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
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Guardar
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeOverlay}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LibroDiario;
