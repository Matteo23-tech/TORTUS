import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPhoneAlt } from 'react-icons/fa';
import './Secretaria.css';

export default function Secretaria() {
  const [turnos, setTurnos] = useState([]);
  const [error, setError] = useState('');

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

  return (
    <div className="secretaria-container">
      <div className="header-bar">
        <div className="header-left">
          <h5 className="sede-title">CC URQ 232</h5>
          <div className="text-muted small">Puestos</div>
          <select className="form-select">
            <option>BOX 01 - (URQUIZA 232)</option>
          </select>
        </div>

        <div className="header-center">
          <div className="text-muted small">Ver solo turnos:</div>
          <select className="form-select">
            <option>(AD) Estética, (BF) Otras Especialidades</option>
          </select>
        </div>

        <div className="header-right">
          <div className="user-info dropdown">
            <span className="user-name">Cangioli Mateo ▾</span>
          </div>
          <div className="badges">
            <span className="badge badge-turnos">{turnos.length} turnos pendientes</span>
            <span className="badge badge-derivaciones">0 derivaciones pendientes</span>
          </div>
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
