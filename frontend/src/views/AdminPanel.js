import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const navigate = useNavigate();
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Panel de Administración</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Accede a la gestión de cada módulo del sistema:
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
        {/* <Button variant="contained" color="primary" onClick={() => navigate('/usuarios')}>Gestionar Usuarios</Button> */}
        <Button variant="contained" color="secondary" onClick={() => navigate('/autores')}>Gestionar Autores</Button>
        <Button variant="contained" color="success" onClick={() => navigate('/publicaciones')}>Gestionar Publicaciones</Button>
        <Button variant="contained" color="info" onClick={() => navigate('/notificaciones')}>Gestionar Notificaciones</Button>
        <Button variant="contained" color="warning" onClick={() => navigate('/catalogo')}>Ver Catálogo</Button>
        <Button variant="contained" color="error" onClick={() => navigate('/dashboard')}>Volver al Dashboard</Button>
      </Box>
    </Box>
  );
}

export default AdminPanel;
