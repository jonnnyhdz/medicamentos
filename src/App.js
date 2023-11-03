import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './componentes/Login';
import MedicationChart from './componentes/ListaDeMedicamentos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/MedicationChart" element={<MedicationChart />} />
      </Routes>
    </Router>
  );
}

export default App;
