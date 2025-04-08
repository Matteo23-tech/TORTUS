import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPhoneAlt } from 'react-icons/fa';
import './Secretaria.css';
import { useNavigate } from 'react-router-dom';

export default function Secretaria() {
  const [turnos, setTurnos] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Obtenemos el usuario y el box desde localStorage
  const usuario = localStorage.getItem('usuario');
  const box = localStorage.getItem('box');

  // Redireccionar si falta perfil
  useEffect(() => {
    if (!usuario || !box) {
      navigate('/perfil');
    }
  }, [navigate]);

  // Evitar renderizado si no hay perfil
  if (!usuario || !box) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Redirigiendo...</span>
        </div>
      </div>
    );
  }

  useEffect(() => {
    obtenerTurnos();
    const interval = setInterval(obtenerTurnos, 5000);
    return () => clearInterval(interval);
  }, []);

  const obtenerTurnos = async () => {
    try {
      const response = await fetch('http://localhost:5000/turnos');
      const data = await response.json();
      setTurnos(data);
    } catch (error) {
      console.error('Error al obtener los turnos:', error);
      setError('Error al obtener los turnos');
    }
  };

  const llamarTurno = async (turno) => {
    try {
      await fetch('http://localhost:5000/turno-actual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(turno),
      });
      obtenerTurnos();
    } catch (error) {
      console.error('Error al llamar turno:', error);
      setError('Error al llamar el turno');
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('box');
    navigate('/perfil'); // Redirige al selector de perfil en vez de al inicio
  };

  return (
    <div className="secretaria-container">
      <div className="header-bar d-flex justify-content-between align-items-center">
        <div className="header-left">
          <div className="fw-bold text-primary">CC URQ 232</div>
          <div className="text-muted small">Puestos</div>
          <select className="form-select form-select-sm w-auto">
            <option>{box}</option>
          </select>
        </div>

        <div className="header-center">
          <div className="text-muted small">Ver solo turnos:</div>
          <select className="form-select form-select-sm w-auto">
            <option>(AD) Estética, (BF) Otras Especialidades</option>
          </select>
        </div>

        <div className="header-right d-flex align-items-center gap-3">
          <div className="dropdown">
            <button
              className="btn btn-light dropdown-toggle user-name"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {usuario}
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li><button className="dropdown-item">Perfil</button></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item text-danger" onClick={cerrarSesion}>Cerrar sesión</button></li>
            </ul>
          </div>

          <span className="badge bg-warning text-dark">{turnos.length} turnos pendientes</span>
          <span className="badge bg-primary">0 derivaciones pendientes</span>
        </div>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <table className="table table-bordered mt-4">
        <thead className="table-light">
          <tr>
            <th>Turno</th>
            <th>Tiempo de espera</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((turno) => (
            <tr key={turno.id}>
              <td><strong>{turno.turno}</strong> ({turno.especialidad})</td>
              <td>00:00 min.</td>
              <td>
                <button className="btn btn-success d-flex align-items-center" onClick={() => llamarTurno(turno)}>
                  Llamar <FaPhoneAlt className="ms-2" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
