import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

function AutorPanel({ setFeedback }) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({
    titulo: '',
    resumen: '',
    palabrasClave: '',
    tipo: 'ARTICULO',
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8083/publicaciones/mis-publicaciones', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener publicaciones');
        return res.json();
      })
      .then((data) => {
        setPublicaciones(data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo cargar tus publicaciones.');
        setLoading(false);
        setFeedback && setFeedback('No se pudo cargar tus publicaciones.');
      });
  }, [token, setFeedback]);

  const handleOpen = (idx = null) => {
    setEditIdx(idx);
    if (idx !== null) {
      const pub = publicaciones[idx];
      setForm({
        titulo: pub.titulo,
        resumen: pub.resumen,
        palabrasClave: pub.palabrasClave?.join(', ') || '',
        tipo: pub.tipo || 'ARTICULO',
      });
    } else {
      setForm({ titulo: '', resumen: '', palabrasClave: '', tipo: 'ARTICULO' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditIdx(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      palabrasClave: form.palabrasClave.split(',').map(p => p.trim()),
    };
    try {
      const url = editIdx !== null
        ? `http://localhost:8083/publicaciones/${publicaciones[editIdx].id}`
        : 'http://localhost:8083/publicaciones';
      const method = editIdx !== null ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Error al guardar publicación');
      setFeedback && setFeedback(editIdx !== null ? 'Publicación actualizada.' : 'Publicación creada.');
      handleClose();
      // Refrescar lista
      setLoading(true);
      fetch('http://localhost:8083/publicaciones/mis-publicaciones', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.json())
        .then(data => { setPublicaciones(data); setLoading(false); });
    } catch {
      setFeedback && setFeedback('Error al guardar publicación.');
    }
  };

  const handleDelete = async (idx) => {
    if (!window.confirm('¿Eliminar publicación?')) return;
    try {
      const res = await fetch(`http://localhost:8083/publicaciones/${publicaciones[idx].id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al eliminar publicación');
      setFeedback && setFeedback('Publicación eliminada.');
      // Refrescar lista
      setLoading(true);
      fetch('http://localhost:8083/publicaciones/mis-publicaciones', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.json())
        .then(data => { setPublicaciones(data); setLoading(false); });
    } catch {
      setFeedback && setFeedback('Error al eliminar publicación.');
    }
  };

  const handleEnviarRevision = async (idx) => {
    if (!window.confirm('¿Enviar publicación a revisión?')) return;
    try {
      const res = await fetch(`http://localhost:8083/publicaciones/${publicaciones[idx].id}/enviar-revision`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al enviar publicación a revisión');
      setFeedback && setFeedback('Publicación enviada a revisión.');
      // Refrescar lista
      setLoading(true);
      fetch('http://localhost:8083/publicaciones/mis-publicaciones', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.json())
        .then(data => { setPublicaciones(data); setLoading(false); });
    } catch {
      setFeedback && setFeedback('Error al enviar publicación a revisión.');
    }
  };

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>Panel de Autor</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Puedes crear y editar borradores de publicaciones, y responder solicitudes de cambio.
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>Mis Publicaciones</Typography>
      {loading && <CircularProgress sx={{ my: 2 }} />}
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => handleOpen()}>
        Nueva Publicación
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIdx !== null ? 'Editar Publicación' : 'Nueva Publicación'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="Título"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Resumen"
              name="resumen"
              value={form.resumen}
              onChange={handleChange}
              fullWidth
              multiline
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Palabras Clave (separadas por coma)"
              name="palabrasClave"
              value={form.palabrasClave}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Tipo"
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              select
              SelectProps={{ native: true }}
              fullWidth
              sx={{ mb: 2 }}
            >
              <option value="ARTICULO">Artículo</option>
              <option value="LIBRO">Libro</option>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">{editIdx !== null ? 'Actualizar' : 'Crear'}</Button>
          </DialogActions>
        </form>
      </Dialog>
      <List>
        {publicaciones.length === 0 && !loading && <ListItem><ListItemText primary="No tienes publicaciones." /></ListItem>}
        {publicaciones.map((pub, idx) => (
          <Card key={idx} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{pub.titulo}</Typography>
              <Typography variant="body2" color="text.secondary">Estado: {pub.estado} — Versión: {pub.versionActual}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{pub.resumen}</Typography>
              <Button size="small" onClick={() => handleOpen(idx)} sx={{ mr: 1 }}>Editar</Button>
              <Button size="small" color="error" onClick={() => handleDelete(idx)} sx={{ mr: 1 }}>Eliminar</Button>
              {pub.estado === 'BORRADOR' && (
                <Button size="small" color="secondary" variant="outlined" onClick={() => handleEnviarRevision(idx)} sx={{ mr: 1 }}>
                  Enviar a Revisión
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </List>
    </div>
  );
}

export default AutorPanel;
