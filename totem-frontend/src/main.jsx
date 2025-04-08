import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TurnoProvider } from './components/TurnoContext'; // Asegúrate de importar correctamente

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TurnoProvider>
      <App />
    </TurnoProvider>
  </React.StrictMode>
);