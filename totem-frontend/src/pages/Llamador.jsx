import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Llamador() {
  const [turnoActual, setTurnoActual] = useState(null);
  const [ultimoTurnoHablado, setUltimoTurnoHablado] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerTurnoLlamado();
    const interval = setInterval(obtenerTurnoLlamado, 5000); // Consulta el turno cada 5 segundos
    return () => clearInterval(interval);
  }, [ultimoTurnoHablado]); // Dependencia de último turno hablado

  const obtenerTurnoLlamado = async () => {
    try {
      const response = await fetch('http://localhost:5000/turno-actual');
      if (!response.ok) throw new Error('No se pudo obtener el turno actual');
      const data = await response.json();

      if (!data || data.length === 0) {
        setError('No hay turnos llamados en este momento');
        setTurnoActual(null);
      } else {
        setTurnoActual(data);
        setError('');

        // Solo habla si el turno es nuevo y no está siendo hablado
        if (data.turno !== ultimoTurnoHablado && !speechSynthesis.speaking) {
          hablarTurno(data.turno, data.especialidad);
        }
      }
    } catch (error) {
      console.error('Error al obtener el turno actual:', error);
      setError('Error al conectar con el servidor');
      setTurnoActual(null);
    }
  };

  // 🔊 Función para hacer que el llamador hable (solo una vez por turno)
  const hablarTurno = (turno) => {
    if ('speechSynthesis' in window) {
      const mensaje = new SpeechSynthesisUtterance(` ${turno}, dirijase al box 1.`);
      mensaje.lang = 'es-ES'; // Configurar idioma español
      mensaje.rate = 1; // Velocidad normal
      mensaje.pitch = 1; // Tono normal

      mensaje.onend = () => {
        setUltimoTurnoHablado(turno); // Guardar el turno anunciado
      };

      speechSynthesis.speak(mensaje);
    } else {
      console.warn('Tu navegador no soporta síntesis de voz.');
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white">
      <div className="card text-center shadow-lg p-4 bg-primary text-white" style={{ maxWidth: '600px', width: '100%' }}>
        <h1 className="card-title">Turno en Llamado</h1>
        {turnoActual ? (
          <>
            <h2 className="display-1 fw-bold">{turnoActual.turno}</h2>   
          </>
        ) : (
          <p className="mt-3">No hay turnos en espera</p>
        )}
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
