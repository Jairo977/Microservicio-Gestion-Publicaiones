import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function NotificacionesPanel() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Llamada al backend para obtener notificaciones del usuario
    const token = localStorage.getItem('token');
    fetch('http://localhost:8084/notificaciones', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar notificaciones');
        return res.json();
      })
      .then((data) => setNotificaciones(data))
      .catch(() => {
        setNotificaciones([]);
        setError('No se pudieron cargar las notificaciones.');
      });
  }, []);

  return (
    <div>
      <h2>Notificaciones</h2>
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
      <ul style={{listStyle: 'none', padding: 0}}>
        {notificaciones.length === 0 && !error && <li>No hay notificaciones.</li>}
        {notificaciones.map((n, i) => (
          <li key={i}>
            <Card sx={{ mb: 2, background: n.importante ? '#fff3e0' : undefined }}>
              <CardContent>
                <Typography variant="body1">{n.mensaje}</Typography>
                {n.fecha && (
                  <Typography variant="caption" color="text.secondary">
                    {new Date(n.fecha).toLocaleString()}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificacionesPanel;
