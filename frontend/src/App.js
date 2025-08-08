import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import Catalog from './views/Catalog';
import NotFound from './views/NotFound';
import AdminPanel from './views/AdminPanel';
import UsuariosPanel from './views/UsuariosPanel';
import AutoresPanel from './views/AutoresPanel';
import NotificacionesGestionPanel from './views/NotificacionesGestionPanel';
import PublicacionesPanel from './views/PublicacionesPanel';

function App() {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/usuarios" element={<UsuariosPanel />} />
          <Route path="/autores" element={<AutoresPanel />} />
          <Route path="/publicaciones" element={<PublicacionesPanel />} />
          <Route path="/notificaciones" element={<NotificacionesGestionPanel />} />
          <Route path="/catalogo" element={<div>Catálogo (en construcción)</div>} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
