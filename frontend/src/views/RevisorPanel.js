import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function RevisorPanel({ setFeedback }) {
  const [asignadas, setAsignadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comentario, setComentario] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:8083/publicaciones/asignadas-revisor', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener publicaciones asignadas');
        return res.json();
      })
      .then((data) => {
        setAsignadas(data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo cargar tus publicaciones asignadas.');
        setLoading(false);
      });
  }, [token]);

  const handleAccion = async (idx, accion) => {
    if (!comentario) {
      setFeedback && setFeedback('Debes ingresar un comentario.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:8083/publicaciones/${asignadas[idx].id}/revisar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comentario, recomendacion: accion }),
      });
      if (!res.ok) throw new Error('Error al enviar revisión');
      setFeedback && setFeedback(`Revisión enviada: ${accion.replace('_', ' ')}.`);
      setComentario('');
      setSelectedIdx(null);
      setLoading(true);
      fetch('http://localhost:8083/publicaciones/asignadas-revisor', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.json())
        .then(data => { setAsignadas(data); setLoading(false); });
    } catch {
      setFeedback && setFeedback('Error al enviar revisión.');
    }
  };

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>Panel de Revisor</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Puedes ver publicaciones asignadas, comentar y emitir recomendaciones.
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>Publicaciones Asignadas</Typography>
      {loading && <CircularProgress sx={{ my: 2 }} />}
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
      <div>
        {asignadas.length === 0 && !loading && !error && (
          <Alert severity="info">No tienes publicaciones asignadas.</Alert>
        )}
        {asignadas.map((pub, idx) => (
          <Card key={idx} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{pub.titulo}</Typography>
              <Typography variant="body2" color="text.secondary">Estado: {pub.estado} — Versión: {pub.versionActual}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{pub.resumen}</Typography>
              {selectedIdx === idx ? (
                <div style={{marginTop:8}}>
                  <TextField
                    label="Comentario"
                    value={comentario}
                    onChange={e => setComentario(e.target.value)}
                    fullWidth
                    multiline
                    sx={{ mb: 1 }}
                  />
                  <Button size="small" color="success" variant="contained" onClick={() => handleAccion(idx, 'ACEPTAR')} sx={{ mr: 1 }}>Aceptar</Button>
                  <Button size="small" color="warning" variant="contained" onClick={() => handleAccion(idx, 'CAMBIOS_SOLICITADOS')} sx={{ mr: 1 }}>Solicitar Cambios</Button>
                  <Button size="small" color="error" variant="contained" onClick={() => handleAccion(idx, 'RECHAZAR')} sx={{ mr: 1 }}>Rechazar</Button>
                  <Button size="small" onClick={() => {setSelectedIdx(null); setComentario('');}}>Cancelar</Button>
                </div>
              ) : (
                <Button size="small" onClick={() => setSelectedIdx(idx)} sx={{ mt: 1 }}>Comentar / Recomendar</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default RevisorPanel;
