import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/autenticacion/Login';
import Registro from './pages/autenticacion/Registro';
import HomePage from './Home';
import ListaProyectos from './pages/proyectos/ListaProyectos';

import EditProyectosList from './pages/proyectos/editProyectosList';
import FormProyectos from './pages/proyectos/formProyectos';
import ProyectoDetail from './pages/proyectos/ProyectoDetail';
import './index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import PlanDeCuentas from './pages/contabilidad/PlanDeCuentas';
import BalanceComprobacion from './pages/contabilidad/BalanceComprobacion';
import LibroDiario from './pages/contabilidad/LibroDiario';
import BalanceGeneral from './pages/contabilidad/BalanceGeneral';
import FlujoEfectivo from './pages/contabilidad/FlujoEfectivo';
import EstadoResultados from './pages/contabilidad/EstadoResultado';


const router = createBrowserRouter([
  {
    path: "/",
    element:<HomePage />,
  },
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
    path: "/misProyectos",
    element: <ListaProyectos />,  
  },
  {
    path: "/proyecto/:id",
    element: <ProyectoDetail />,
  },
  {
    path: "/editMisProyectos",
    element: <EditProyectosList />,
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
    element:<BalanceComprobacion />,
  },
  {
    path: "/libroDiario",
    element: <LibroDiario />,
  },
  {
    path: "/balanceGeneral",
    element: <BalanceGeneral />,
  },
  {
    path: "/flujoEfectivo",
    element: <FlujoEfectivo />,
  },
  {
    path: "/estadoResultado",
    element: <EstadoResultados />,

  },
  {
    path: "/home",
    element:<HomePage />,
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
