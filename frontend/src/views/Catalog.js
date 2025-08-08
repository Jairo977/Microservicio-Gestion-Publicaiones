import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Catalog() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Lógica para consumir el backend de catálogo
    fetch('http://localhost:8083/catalogo/publicaciones')
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener publicaciones');
        return res.json();
      })
      .then((data) => {
        setPublicaciones(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('No se pudo cargar el catálogo.');
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#1e293b' }}>Catálogo de Publicaciones</Typography>
      <Typography variant="body1" sx={{ mb: 3, color: '#475569' }}>
        Consulta el catálogo público de publicaciones aprobadas. Aquí puedes buscar, filtrar y explorar artículos y libros publicados en la plataforma.
      </Typography>
      <Paper sx={{ p: 2, minHeight: 200 }}>
        {loading && <p>Cargando publicaciones...</p>}
        {error && <p style={{color: 'red'}}>{error}</p>}
        <ul>
          {publicaciones.length === 0 && !loading && <li>No hay publicaciones disponibles.</li>}
          {publicaciones.map((pub, idx) => (
            <li key={idx}>
              <strong>{pub.titulo}</strong> — {pub.autorPrincipal} <br/>
              <span>{pub.resumen}</span>
            </li>
          ))}
        </ul>
        {publicaciones.length > 0 && (
          <Typography variant="body2" color="text.secondary">(Vista de catálogo en construcción)</Typography>
        )}
      </Paper>
    </Box>
  );
}

export default Catalog;
