import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Registro from "./Registro.jsx";
import Login from "./login.jsx";

const router = createBrowserRouter([
  {
    path: "/registro",
    element: <Registro />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
