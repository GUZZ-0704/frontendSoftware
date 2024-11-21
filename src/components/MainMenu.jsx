import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import './MainMenu.css'; // Importa el archivo CSS

const MainMenu = () => {
    return (
        <Navbar expand="lg" className="navbar-custom">
            <Container>
                <Navbar.Brand href="/home">
                    RavenTech
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavDropdown title="Proyectos" id="generos-nav-dropdown">
                            <Link className="dropdown-item" to={"/MisProyectos"}>
                                Ver Mis Proyectos
                            </Link>
                            <Link className="dropdown-item" to={"/EditMisProyectos"}>
                                Editar Mis Proyectos
                            </Link>
                        </NavDropdown>
                        {/* TODO: agregar más opciones */}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MainMenu;
