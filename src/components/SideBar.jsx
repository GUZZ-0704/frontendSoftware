import { Navbar, Nav } from "react-bootstrap";
import "./SideBar.css";

const Sidebar = () => {
  return (
    <Navbar className="sidebar">
      <Nav className="flex-column w-100">
        <Nav.Link href="/account" className="nav-link">
          <i className="bi bi-person icon"></i>
          Cuenta
        </Nav.Link>

        <Nav.Link href="/inbox" className="nav-link">
          <i className="bi bi-box-fill icon"></i>
          Proyectos
        </Nav.Link>

        <div className="nav-submenu">
          <Nav.Link href="/misProyectos" className="nav-link">
            Mis proyectos
          </Nav.Link>
          <Nav.Link href="/editMisProyectos" className="nav-link">
            Editar proyecto
          </Nav.Link>
        </div>

        <Nav.Link href="/inbox" className="nav-link">
        <i className="bi bi-newspaper icon"></i>
          Contabilidad
        </Nav.Link>
        <div className="nav-submenu">
          <Nav.Link href="/libroDiario" className="nav-link">
            Libro diario
          </Nav.Link>
          <Nav.Link href="/flujoEfectivo" className="nav-link">
            Flujo efectivo
          </Nav.Link>
          <Nav.Link href="/cuenta" className="nav-link">
            Plan de cuentas
          </Nav.Link>
          <Nav.Link href="/balancegeneral" className="nav-link">
            Balance general
            {/*<span className="notification-badge">20+</span>*/}
          </Nav.Link>

          <Nav.Link href="/estadoResultado" className="nav-link">
            Estado resultado
          </Nav.Link>
          <Nav.Link href="/balanceComprobacion" className="nav-link">
            B. Comprobacion
          </Nav.Link>
        </div>

        <Nav.Link href="/sent" className="nav-link">
          <i className="bi bi-send icon"></i>
          Mensajes 
        </Nav.Link>

        <Nav.Link href="/scheduled" className="nav-link">
          <i className="bi bi-clock icon"></i>
          Horario
        </Nav.Link>

        <h6 className="mt-2 mb-2 text-muted">Account</h6>
        <Nav.Link href="/settings" className="nav-link">
          <i className="bi bi-gear icon"></i>
          Settings
        </Nav.Link>
        <Nav.Link href="/notifications" className="nav-link">
          <i className="bi bi-bell icon"></i>
          Notificaciones 
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default Sidebar;
