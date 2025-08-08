import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';

function PublicacionesPanel() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ titulo: '', resumen: '', palabrasClave: '', tipo: 'ARTICULO' });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetch('http://localhost:8083/publicaciones')
      .then(res => res.json())
      .then(data => { setPublicaciones(data); })
      .catch(() => { setError('No se pudieron cargar las publicaciones.'); });
  }, []);

  const handleOpen = () => { setForm({ titulo: '', resumen: '', palabrasClave: '', tipo: 'ARTICULO' }); setOpen(true); };
  const handleClose = () => { setOpen(false); };
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = { ...form, palabrasClave: form.palabrasClave.split(',').map(p => p.trim()) };
      const res = await fetch('http://localhost:8083/publicaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      setFeedback('Publicación creada correctamente.');
      setOpen(false);
      fetch('http://localhost:8083/publicaciones')
        .then(res => res.json())
        .then(data => setPublicaciones(data));
    } catch {
      setFeedback('Error al crear publicación.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar publicación?')) return;
    try {
      const res = await fetch(`http://localhost:8083/publicaciones/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      setFeedback('Publicación eliminada correctamente.');
      fetch('http://localhost:8083/publicaciones')
        .then(res => res.json())
        .then(data => setPublicaciones(data));
    } catch {
      setFeedback('Error al eliminar publicación.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#1e293b' }}>Gestión de Publicaciones</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {feedback && <Alert severity="info" sx={{ mb: 2 }}>{feedback}</Alert>}
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>Nueva Publicación</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Resumen</TableCell>
              <TableCell>Palabras Clave</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(publicaciones) && publicaciones.map((pub) => (
              <TableRow key={pub.id}>
                <TableCell>{pub.titulo}</TableCell>
                <TableCell>{pub.resumen}</TableCell>
                <TableCell>{Array.isArray(pub.palabrasClave) ? pub.palabrasClave.join(', ') : ''}</TableCell>
                <TableCell>{pub.tipo}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => handleDelete(pub.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Nueva Publicación</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField label="Título" name="titulo" value={form.titulo} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
            <TextField label="Resumen" name="resumen" value={form.resumen} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
            <TextField label="Palabras Clave (separadas por coma)" name="palabrasClave" value={form.palabrasClave} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Tipo" name="tipo" value={form.tipo} onChange={handleChange} select SelectProps={{ native: true }} fullWidth sx={{ mb: 2 }}>
              <option value="ARTICULO">ARTICULO</option>
              <option value="LIBRO">LIBRO</option>
            </TextField>
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

export default PublicacionesPanel;
