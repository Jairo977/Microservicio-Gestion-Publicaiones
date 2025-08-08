import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';

function NotificacionesGestionPanel() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ mensaje: '', destinatario: '', importante: false });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetch('http://localhost:8084/notificaciones')
      .then(res => res.json())
      .then(data => { setNotificaciones(data); setLoading(false); })
      .catch(() => { setError('No se pudieron cargar las notificaciones.'); setLoading(false); });
  }, []);

  const handleOpen = () => { setForm({ mensaje: '', destinatario: '', importante: false }); setOpen(true); };
  const handleClose = () => { setOpen(false); };
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleCheck = e => setForm({ ...form, importante: e.target.checked });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8084/notificaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error();
      setFeedback('Notificación enviada correctamente.');
      setOpen(false);
      fetch('http://localhost:8084/notificaciones')
        .then(res => res.json())
        .then(data => setNotificaciones(data));
    } catch {
      setFeedback('Error al enviar notificación.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar notificación?')) return;
    try {
      const res = await fetch(`http://localhost:8084/notificaciones/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      setFeedback('Notificación eliminada correctamente.');
      fetch('http://localhost:8084/notificaciones')
        .then(res => res.json())
        .then(data => setNotificaciones(data));
    } catch {
      setFeedback('Error al eliminar notificación.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#1e293b' }}>Gestión de Notificaciones</Typography>
      <Typography variant="body1" sx={{ mb: 3, color: '#475569' }}>
        Envía y visualiza notificaciones del sistema. Aquí puedes crear alertas para usuarios, revisores, autores y otros actores del sistema.
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpen}>Nueva Notificación</Button>
      {feedback && <Alert severity={feedback.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>{feedback}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mensaje</TableCell>
              <TableCell>Destinatario</TableCell>
              <TableCell>Importante</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notificaciones.map((n, i) => (
              <TableRow key={i}>
                <TableCell>{n.mensaje}</TableCell>
                <TableCell>{n.destinatario}</TableCell>
                <TableCell>{n.importante ? 'Sí' : 'No'}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => handleDelete(n.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Nueva Notificación</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField label="Mensaje" name="mensaje" value={form.mensaje} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
            <TextField label="Destinatario" name="destinatario" value={form.destinatario} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <label>
              <input type="checkbox" checked={form.importante} onChange={handleCheck} /> Importante
            </label>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">Enviar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default NotificacionesGestionPanel;
