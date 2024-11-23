import { Navbar, Container, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import "./Header.css";
import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {

  const navigate = useNavigate();
  return (
    <Navbar className="header">
      <Container fluid className="d-flex justify-content-between align-items-center">
        <h5 onClick={() => navigate("/misProyectos") }>{title}</h5>
        <div>
          <Button variant="primary" className="me-2">
            Hola, lu 
          </Button>
          <Button className="rounded-circle">
            <i className="bi bi-person"></i>
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
