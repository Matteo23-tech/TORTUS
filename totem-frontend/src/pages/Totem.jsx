import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Totem.css';

export default function Totem() {
  const [turnos, setTurnos] = useState({ A: 0, B: 0, C: 0 });
  const [turno, setTurno] = useState(null);
  const especialidades = [
    { id: 'A', nombre: 'CONSULTA MEDICA' },
    { id: 'B', nombre: 'ESTETICA' },
    { id: 'C', nombre: 'SACAR TURNO' }
  ];

  const generarTurno = async (especialidad) => {
    const nuevoNumero = turnos[especialidad] + 1;
    const nuevoTurno = `${especialidad}${nuevoNumero}`;

    setTurnos((prev) => ({ ...prev, [especialidad]: nuevoNumero }));
    setTurno(nuevoTurno);

    await fetch('http://localhost:5000/turnos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ turno: nuevoTurno, especialidad })
    });
  };

  return (
    <div className="totem-container d-flex flex-column align-items-center text-center">
      <div className="logo">TOTTEM </div>
      <p className="instrucciones">Por favor, elija una opción</p>
      {especialidades.map((esp) => (
        <button key={esp.id} className="btn btn-totem" onClick={() => generarTurno(esp.id)}>
          {esp.nombre}
        </button>
      ))}
      {turno && <h3 className="turno">Tu turno: {turno}</h3>}
    </div>
  );
}
