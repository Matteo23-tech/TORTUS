import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TurnoProvider } from './components/TurnoContext';
import WelcomePage from './pages/WelcomePage';
import Totem from './pages/Totem';
import Llamador from './pages/Llamador';
import Secretaria from './pages/Secretaria';
import Doctor from './pages/Doctor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/doctor/totem" element={<Totem />} />
        <Route path="/doctor/llamador" element={<Llamador />} />
        <Route path="/doctor/secretaria" element={<Secretaria />} />
        <Route path="/doctor" element={<Doctor />} />
      </Routes>
    </Router>
  );
}

export default App;
