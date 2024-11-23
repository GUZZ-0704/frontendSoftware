import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "./PlanDeCuenta.css";
import Header from './../../components/Header';
import Sidebar from './../../components/SideBar';

const PlanDeCuentas = () => {
  const navigate = useNavigate();
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [newCuenta, setNewCuenta] = useState({
    nombre: "",
    tipo: "",
  });
  const [newChildCuenta, setNewChildCuenta] = useState({
    nombre: "",
    id: "",
  });
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchCuentas();
  }, [token]);

  const fetchCuentas = async () => {
    try {
      const response = await axios.get("http://localhost:3000/cuentas/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCuentas(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching data: " + err.message);
      setLoading(false);
      console.log(err);
      if (err.status === 401) {
        navigate("/login");
      }
    }
  };

  //Se agrega estilo según el nivel de la cuenta
  const getRowStyle = (nivel) => {
    if (nivel === 1) {
      return { fontWeight: "bold", fontSize: "1.2rem" };
    } else if (nivel === 2) {
      return { fontWeight: "600", fontSize: "1.1rem" };
    } else {
      return { fontWeight: "normal", fontSize: "1rem" };
    }
  };

  const handleEdit = (id) => setEditId(id);

  const handleDelete = async (id) => {
    //alert para confirmar eliminación
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar la cuenta?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:3000/cuentas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCuentas(cuentas.filter((cuenta) => cuenta.id !== id));
    } catch (err) {
      setError("Error deleting data: " + err.message);
    }
  };

  const handleSave = async (id) => {
    const cuentaToEdit = cuentas.find((cuenta) => cuenta.id === id);
    try {
      await axios.put(`http://localhost:3000/cuentas/${id}`, cuentaToEdit, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditId(null);
    } catch (err) {
      setError("Error saving data: " + err.message);
    }
  };

  const handleAdd = async () => {
    if (!newCuenta.nombre || !newCuenta.tipo) {
      //TODO: mejorar alerta
      alert("Por favor, complete todos los campos");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/cuentas/nivel1",
        newCuenta,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCuentas([...cuentas, response.data]);
      setNewCuenta({ nombre: "", tipo: "" });
    } catch (err) {
      setError("Error adding data: " + err.message);
    }
  };

  const handleNewChild = (id) => {
    setShowForm(!showForm);
    setNewChildCuenta({ ...newChildCuenta, id });
  };

  const handleAddChild = async () => {
    if (!newChildCuenta.nombre) {
      //TODO: mejorar alerta
      alert("Por favor, Ingrese un nombre");
      return;
    }
    try {
      await axios
        .post(
          `http://localhost:3000/cuentas/${newChildCuenta.id}/child`,
          newChildCuenta,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          setCuentas([...cuentas, response.data]);
          console.log(response.data);
          setNewChildCuenta({ nombre: "", id: "" });
        });
    } catch (err) {
      setError("Error adding data: " + err.message);
    } finally {
      fetchCuentas();
      setShowForm(false);
    }
  };

  const renderCuentas = (cuentas) => {
    return cuentas.map((cuenta) => (
      <tr key={cuenta.id} style={{ ...getRowStyle(cuenta.nivel) }}>
        <td
          style={{
            paddingLeft: `${cuenta.nivel * 20}px`,
          }}
        >
          {cuenta.codigo}
        </td>
        <td
          style={{
            paddingLeft: `${cuenta.nivel * 20}px`,
          }}
        >
          {editId === cuenta.id ? (
            <input
              type="text"
              className="form-control"
              value={cuenta.nombre}
              onChange={(e) =>
                setCuentas(
                  cuentas.map((c) =>
                    c.id === cuenta.id ? { ...c, nombre: e.target.value } : c
                  )
                )
              }
            />
          ) : (
            cuenta.nombre
          )}
        </td>
        <td>{cuenta.tipo}</td>
        <td>
          {editId === cuenta.id ? (
            <button
              className="btn btn-success btn-sm"
              onClick={() => handleSave(cuenta.id)}
            >
              Save
            </button>
          ) : (
            <>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginRight: "5px" }}
                onClick={() => handleNewChild(cuenta.id)}
              >
                Add
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleEdit(cuenta.id)}
              >
                Editar
              </button>
            </>
          )}
          <button
            className="btn btn-danger btn-sm ms-2"
            onClick={() => handleDelete(cuenta.id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  };

  if (loading)
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );

  return (
    <div className="main-container">
      <Header title="RavenTech" />
      <div className="content-wrapper">
        <Sidebar />
        <div className="content-area">
          <div className="plan-de-cuentas-container">
            <h1 className="plan-de-cuentas-title">Plan de Cuentas</h1>
            <table className="plan-de-cuentas-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cuentas.length > 0 ? (
                  renderCuentas(cuentas)
                ) : (
                  <tr>
                    <td colSpan="4" className="no-cuentas">
                      No hay cuentas disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="add-cuenta-form">
              <h3>Agregar Nueva Cuenta</h3>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={newCuenta.nombre}
                  onChange={(e) =>
                    setNewCuenta({ ...newCuenta, nombre: e.target.value })
                  }
                />
                <select
                  value={newCuenta.tipo}
                  onChange={(e) =>
                    setNewCuenta({ ...newCuenta, tipo: e.target.value })
                  }
                >
                  <option value="">Tipo</option>
                  <option value="Activo">Activo</option>
                  <option value="Pasivo">Pasivo</option>
                  <option value="Patrimonio">Patrimonio</option>
                  <option value="Ingreso">Ingreso</option>
                  <option value="Egreso">Egreso</option>
                </select>
                <button className="custom-button" onClick={handleAdd}>
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar Subcuenta</h3>
            <div className="input-group">
              <input
                type="text"
                placeholder="Nombre de la subcuenta"
                value={newChildCuenta.nombre}
                onChange={(e) =>
                  setNewChildCuenta({ ...newChildCuenta, nombre: e.target.value })
                }
              />
              <button className="custom-button" onClick={handleAddChild}>
                Agregar
              </button>
              <button
                className="custom-button-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PlanDeCuentas;
