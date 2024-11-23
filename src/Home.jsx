
import './Home.css'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

    const navigate = useNavigate();
  return (
    <div className="homepage-container">
      {/* Navbar */}
      <nav className="navbarHome">
        <div className="logo">RavenTech</div>
        <ul className="nav-linksHome">
          <li>Home</li>
          <li>About</li>
          <li>Offers</li>
          <li>Services</li>
          <li>Contact</li>
        </ul>
        <div className="nav-actions">
          <button className="btn-secondary" onClick={() => navigate('/login')}>Login</button>
          <button className="btn-primary"onClick={() => navigate('/registro')}>Sing in</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
            Simplifica Tu Contabilidad
        </h1>
        <h1 className='hero-subtitle'>
        Lleva un control detallado de ingresos y gastos con reportes claros y accesibles.

        </h1>
        <img
          src="/src/assets/contabilidad.png"
          alt="calculadora"
          className="hero-image"
        />
      </div>

        {/* Services Section */}
        <div className="services-section">
            <h2 className="section-title">Our Services</h2>
            <div className="services-container">
                <div className="service">
                <h3 style={{fontWeight:'900'}}>Control de balances</h3>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                    eget tortor risus.
                </p>
                </div>
                <div className="service">
                <h3 style={{fontWeight:'900'}}>Control de Ingresos y Gastos</h3>
                <p>
                Lleva un control preciso de tus finanzas con categorización automática de ingresos y gastos.
                </p>
                </div>
                <div className="service">
                <h3 style={{fontWeight:'900'}}>Reportes Financieros</h3>
                <p>
                Genera reportes financieros personalizados, como estados de resultados y balances generales.
                </p>
                </div>
            </div>

      </div>
      <footer className="footer-custom">
        <div className="footer-container">
          <div className="footer-logo">RavenTech</div>
          <ul className="footer-links">
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
          <div className="footer-socials">
            <a href="#"><i className="bi bi-facebook"></i></a>
            <a href="#"><i className="bi bi-twitter"></i></a>
            <a href="#"><i className="bi bi-instagram"></i></a>
            <a href="#"><i className="bi bi-linkedin"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
