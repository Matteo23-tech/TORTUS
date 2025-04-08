import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './WelcomePage.css';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [isDoctorMenuOpen, setIsDoctorMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const goToSection = (section) => {
    navigate(`/${section}`);
    setIsDoctorMenuOpen(false); // Cierra el menú al hacer clic
  };

  const toggleDoctorMenu = () => {
    setIsDoctorMenuOpen((prev) => !prev);
  };

  // Detectar clic fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDoctorMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="welcome-page">
      <nav className="navbar-custom">
        <div className="nav-left">
          <button onClick={() => goToSection('totem')}>Nuestro servicio</button>
          <button onClick={() => goToSection('llamador')}>Nosotros</button>
          <button onClick={() => goToSection('secretaria')}>Secretaría</button>
        </div>

        <div className="navbar-center">
          <span className="brand-name">.TORTUS.</span>
        </div>

        <div className="nav-right">
          <button onClick={() => goToSection('blog')}>Blog</button>
          <button onClick={() => goToSection('soporte')}>Soporte</button>

          {/* Dropdown Doctor */}
          <div className="dropdown" ref={dropdownRef}>
            <button className="dropdown-toggle" onClick={toggleDoctorMenu}>
              INGRESAR
            </button>
            {isDoctorMenuOpen && (
              <div className="dropdown-menu show">
                <button onClick={() => goToSection('doctor/totem')}>Totem</button>
                <button onClick={() => goToSection('doctor/llamador')}>Llamador</button>
                <button onClick={() => goToSection('doctor/secretaria')}>Secretaria</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="welcome-content">
        <img src="/logo.png" alt="Logo Horus" className="logo" />
        <h1 className="main-title">El Software que va a hacer crecer tu empresa</h1>
        <h2 className="subtitle">.TORTUS.</h2>
        <p className="tagline">SOFTWARE DE ATENCIÓN</p>
      </div>
    </div>
  );
}
