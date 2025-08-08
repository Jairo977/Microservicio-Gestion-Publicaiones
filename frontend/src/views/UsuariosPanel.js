import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

function UsuariosPanel() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#1e293b' }}>Gestión de Usuarios</Typography>
      <Alert severity="warning">Funcionalidad no disponible: No existe un microservicio de usuarios en el backend.</Alert>
    </Box>
  );
}

export default UsuariosPanel;
