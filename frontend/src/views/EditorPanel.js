import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function EditorPanel({ setFeedback }) {
  const [enRevision, setEnRevision] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [motivo, setMotivo] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:8083/publicaciones/en-revision', {
      headers: {
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener publicaciones en revisión');
        return res.json();
      })
      .then((data) => {
        setEnRevision(data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo cargar las publicaciones en revisión.');
        setLoading(false);
      });
  }, [token]);

  const handleAccion = async (idx, accion) => {
    let body = {};
    if (accion === 'FORZAR_ESTADO' && !motivo) {
      setFeedback && setFeedback('Debes ingresar un motivo para forzar estado.');
      return;
    }
    if (accion === 'FORZAR_ESTADO') body = { estado: 'FORZADO', motivo };
    try {
      const res = await fetch(`http://localhost:8083/publicaciones/${enRevision[idx].id}/${accion.toLowerCase()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: Object.keys(body).length ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error('Error en la acción');
      setFeedback && setFeedback('Acción realizada correctamente.');
      setMotivo('');
      setSelectedIdx(null);
      // Refrescar lista
      setLoading(true);
      fetch('http://localhost:8083/publicaciones/en-revision', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.json())
        .then(data => { setEnRevision(data); setLoading(false); });
    } catch {
      setFeedback && setFeedback('Error al realizar la acción.');
    }
  };
  return (
    <div>
      <ul>
        <li>Decidir aprobación final de publicaciones</li>
        <li>Forzar estados especiales</li>
      </ul>
      <h3>Publicaciones en Revisión</h3>
      {loading && <p>Cargando publicaciones...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <ul>
        {enRevision.length === 0 && !loading && <li>No hay publicaciones en revisión.</li>}
        {enRevision.map((pub, idx) => (
          <li key={idx}>
            <strong>{pub.titulo}</strong> — Estado: {pub.estado} — Versión: {pub.versionActual}
            <br/>
            <span>{pub.resumen}</span>
            <div style={{marginTop:8}}>
              <Button size="small" variant="contained" color="success" onClick={() => handleAccion(idx, 'APROBAR')} sx={{mr:1}}>Aprobar</Button>
              <Button size="small" variant="contained" color="error" onClick={() => handleAccion(idx, 'RECHAZAR')} sx={{mr:1}}>Rechazar</Button>
              {selectedIdx === idx ? (
                <span>
                  <TextField
                    label="Motivo"
                    value={motivo}
                    onChange={e => setMotivo(e.target.value)}
                    size="small"
                    sx={{ width: 200, mr: 1 }}
                  />
                  <Button size="small" variant="contained" color="warning" onClick={() => handleAccion(idx, 'FORZAR_ESTADO')} sx={{mr:1}}>Forzar Estado</Button>
                  <Button size="small" onClick={() => {setSelectedIdx(null); setMotivo('');}}>Cancelar</Button>
                </span>
              ) : (
                <Button size="small" color="warning" onClick={() => setSelectedIdx(idx)}>Forzar Estado</Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default EditorPanel;
