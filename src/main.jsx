import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Registro from "./Registro.jsx";
import Login from "./login.jsx";
import HomePage from "./Home.jsx";
import ListaProyectos from "./proyectos/ListaProyectos.jsx";
import DetalleProyecto from "./proyectos/ProyectoDetail.jsx";
import ListaMisProyectos from "./proyectos/editProyectosList.jsx";
import FormProyectos from "./proyectos/formProyectos.jsx";
import PlanDeCuentas from "./contabilidad/PlanDeCuentas.jsx";
import BalanceComprobacion from "./contabilidad/BalanceComprobacion.jsx";
import LibroDiario from "./contabilidad/LibroDiario.jsx";
import BalanceGeneral from "./contabilidad/BalanceGeneral.jsx";
import FlujoEfectivo from "./contabilidad/FlujoEfectivo.jsx";
import EstadoResultados from "./contabilidad/EstadoResultado.jsx";

const router = createBrowserRouter([
  {
    path: "/registro",
    element: <Registro />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/MisProyectos",
    element: <ListaProyectos />,
  },
  {
    path: "/proyecto/:id",
    element: <DetalleProyecto />,
  },
  {
    path: "/EditMisProyectos",
    element: <ListaMisProyectos />,
  },
  {
    path: "/proyecto/formulario",
    element: <FormProyectos />,
  },
  {
    path: "/proyecto/formulario/:id",
    element: <FormProyectos />,
  },
  {
    path: "/cuenta",
    element: <PlanDeCuentas />,
  },
  {
    path: "/balanceComprobacion",
    element: <BalanceComprobacion />,
  },
  {
    path: "/libroDiario",
    element: <LibroDiario />,
  },
  {
    path: "/BalanceGeneral",
    element: <BalanceGeneral />,
  },
  {
    path: "/FlujoEfectivo",
    element: <FlujoEfectivo />,
  },
  {
    path: "/EstadoResultado",
    element: <EstadoResultados />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
