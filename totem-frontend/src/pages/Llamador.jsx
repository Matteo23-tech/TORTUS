import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Llamador.css';

export default function Llamador() {
  const [turnoActual, setTurnoActual] = useState(null);
  const [ultimoTurnoHablado, setUltimoTurnoHablado] = useState(null);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    obtenerTurnoLlamado();
    const interval = setInterval(obtenerTurnoLlamado, 5000);
    return () => clearInterval(interval);
  }, [ultimoTurnoHablado]);

  const obtenerTurnoLlamado = async () => {
    try {
      const response = await fetch('http://localhost:5000/turno-actual');
      const data = await response.json();

      if (
        data &&
        data.turno &&
        data.turno !== ultimoTurnoHablado &&
        !speechSynthesis.speaking
      ) {
        // Guardamos el turno anterior antes de actualizar
        if (turnoActual) {
          setHistorial((prev) => {
            const actualizado = [turnoActual, ...prev];
            return actualizado.slice(0, 2); // mantener solo 2 pasados
          });
        }

        setTurnoActual(data);
        hablarTurno(data.turno, data.especialidad);
      } else {
        setTurnoActual(data);
      }
    } catch (error) {
      console.error('Error al obtener el turno actual:', error);
    }
  };

  const hablarTurno = (turno, especialidad) => {
    const audio = new Audio('/ding.mp3');
    audio.play().then(() => {
      const mensaje = new SpeechSynthesisUtterance(`Turno ${turno}, diríjase al box`);
      mensaje.lang = 'es-ES';
      mensaje.rate = 1;
      mensaje.pitch = 1;
      mensaje.onend = () => setUltimoTurnoHablado(turno);
      speechSynthesis.speak(mensaje);
    }).catch((err) => {
      console.error('Error al reproducir el sonido:', err);
    });
  };

  return (
    <div className="llamador-container">
      {/* ENCABEZADO */}
      <div className="encabezado bg-primary text-white d-flex justify-content-between align-items-center px-4 py-2">
        <h1 className="mb-0">SISTEMA DE LLAMADOS</h1>
        <div className="text-end">
          <h4 className="mb-0">LOGO EMPRESA</h4>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="contenido d-flex">
        {/* COLUMNA IZQUIERDA */}
        <div className="columna-turnos d-flex flex-column flex-fill p-3">

          {/* TURNO ACTUAL */}
          <div className="celda-turno mb-4 flex-fill border rounded d-flex flex-column justify-content-center align-items-center turno-actual bg-light">
            {turnoActual ? (
              <>
                <h2 className="fw-bold display-4">Turno {turnoActual.turno}</h2>
                <h5 className="text-secondary">{turnoActual.especialidad}</h5>
              </>
            ) : (
              <span className="text-muted">Esperando turno...</span>
            )}
          </div>

          {/* TURNOS ANTERIORES */}
          <div className="historial-turnos">
            {historial.map((turno, idx) => (
              <div
                key={idx}
                className="celda-turno mb-3 border rounded d-flex flex-column justify-content-center align-items-center bg-white"
              >
                <h4 className="fw-bold">Turno {turno.turno}</h4>
                <small className="text-muted">{turno.especialidad}</small>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="columna-imagen flex-fill">
          <img
            src="/institucional.jpg"
            alt="Institucional"
            className="img-fluid h-100 w-100 object-fit-cover"
          />
        </div>
      </div>
    </div>
  );
}
