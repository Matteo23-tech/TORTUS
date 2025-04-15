import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Totem.css';

export default function Totem() {
  const [turno, setTurno] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const especialidades = [
    { id: 'A', nombre: 'CONSULTA MÉDICA' },
    { id: 'B', nombre: 'ESTÉTICA' },
    { id: 'C', nombre: 'SACAR TURNO' },
  ];

  const generarTurno = async (especialidad) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/turnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ especialidad }),
      });

      if (!res.ok) throw new Error('No se pudo generar el turno');

      const data = await res.json();
      setTurno(data.turno);
    } catch (err) {
      setError('Hubo un error al generar el turno. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="totem-container d-flex flex-column align-items-center text-center">
      <div className="logo">TORTUS</div>
      <p className="instrucciones">Por favor, elija una opción</p>

      {especialidades.map((esp) => (
        <button
          key={esp.id}
          className="btn btn-totem"
          onClick={() => generarTurno(esp.id)}
          disabled={loading}
        >
          {loading ? 'Generando...' : esp.nombre}
        </button>
      ))}

      {error && <div className="error mt-3">{error}</div>}

      {turno && (
        <div className="turno-animado mt-4">
          <h3>🎟️ Tu turno es:</h3>
          <h1 className="turno-numero">{turno}</h1>
          <p>Espere a ser llamado en pantalla</p>
        </div>
      )}
    </div>
  );
}
