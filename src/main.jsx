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
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
