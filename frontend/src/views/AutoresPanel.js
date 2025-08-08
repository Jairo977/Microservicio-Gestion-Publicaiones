import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import API_BASE_URL from '../apiConfig';

function AutoresPanel() {
  const [autores, setAutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nombres: '', apellidos: '', email: '', afiliacion: '', orcid: '' });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/autores`)
      .then(res => res.json())
      .then(data => {
        console.log('Respuesta backend /autores:', data); // Mostrar en consola la estructura
        // Si el backend devuelve { content: [...] }, usar content, si no, usar data directamente
        if (Array.isArray(data)) {
          setAutores(data);
        } else if (data && Array.isArray(data.content)) {
          setAutores(data.content);
        } else {
          setAutores([]);
        }
        setLoading(false);
      })
      .catch(() => { setError('No se pudieron cargar los autores.'); setLoading(false); });
  }, []);

  const handleOpen = () => { setForm({ nombres: '', apellidos: '', email: '', afiliacion: '', orcid: '' }); setOpen(true); };
  const handleClose = () => { setOpen(false); };
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/autores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error();
      setFeedback('Autor creado correctamente.');
      setOpen(false);
      fetch(`${API_BASE_URL}/autores`)
        .then(res => res.json())
        .then(data => setAutores(data));
    } catch {
      setFeedback('Error al crear autor.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar autor?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/autores/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      setFeedback('Autor eliminado correctamente.');
      fetch(`${API_BASE_URL}/autores`)
        .then(res => res.json())
        .then(data => setAutores(data));
    } catch {
      setFeedback('Error al eliminar autor.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#1e293b' }}>Gestión de Autores</Typography>
      <Typography variant="body1" sx={{ mb: 3, color: '#475569' }}>
        Gestiona los autores registrados y su información académica. Aquí puedes crear, listar y eliminar autores que participan en las publicaciones.
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpen}>Nuevo Autor</Button>
      {feedback && <Alert severity={feedback.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>{feedback}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombres</TableCell>
              <TableCell>Apellidos</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Afiliación</TableCell>
              <TableCell>ORCID</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {autores.map((a, i) => (
              <TableRow key={i}>
                <TableCell>{a.nombres}</TableCell>
                <TableCell>{a.apellidos}</TableCell>
                <TableCell>{a.email}</TableCell>
                <TableCell>{a.afiliacion}</TableCell>
                <TableCell>{a.orcid}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => handleDelete(a.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Nuevo Autor</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField label="Nombres" name="nombres" value={form.nombres} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
            <TextField label="Apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
            <TextField label="Afiliación" name="afiliacion" value={form.afiliacion} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="ORCID" name="orcid" value={form.orcid} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">Crear</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default AutoresPanel;
