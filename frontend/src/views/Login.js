import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Button, Box, Alert } from '@mui/material';

function Login() {
  // Limpiar token y rol al cargar la pantalla de login
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }, []);

  const [form, setForm] = useState({ username: '', password: '' });
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const response = await fetch('http://localhost:12480/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.rol);
        setMensaje('Inicio de sesión exitoso.');
        // Redirigir según el rol
        if (data.rol === 'AUTOR') navigate('/dashboard/autor');
        else if (data.rol === 'REVISOR') navigate('/dashboard/revisor');
        else if (data.rol === 'EDITOR' || data.rol === 'ADMIN') navigate('/dashboard/editor');
        else if (data.rol === 'LECTOR') navigate('/catalog');
        else navigate('/dashboard');
      } else {
        setMensaje('Credenciales incorrectas.');
      }
    } catch (error) {
      setMensaje('Error de conexión con el backend.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    setMensaje('Sesión cerrada.');
    setTimeout(() => setMensaje(''), 1500);
    navigate('/login');
  };

  useEffect(() => {
    // Si ya hay token, redirigir automáticamente
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    if (token && rol) {
      if (rol === 'AUTOR') navigate('/dashboard/autor');
      else if (rol === 'REVISOR') navigate('/dashboard/revisor');
      else if (rol === 'EDITOR' || rol === 'ADMIN') navigate('/dashboard/editor');
      else if (rol === 'LECTOR') navigate('/catalog');
      else navigate('/dashboard');
    } else if (!token) {
      // Si no hay token, asegurarse de estar en /login
      if (window.location.pathname !== '/login') {
        navigate('/login');
      }
    }
  }, [navigate]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ minWidth: 350, maxWidth: 400, p: 2, boxShadow: 6, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 'bold', color: '#1e293b', letterSpacing: 1 }}>
            Plataforma ESPE
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 3, color: '#475569' }}>
            Gestión Integral de Publicaciones
          </Typography>
          {mensaje && (
            <Alert severity={typeof mensaje === 'string' && mensaje.includes('exitoso') ? 'success' : 'error'} sx={{ mb: 2 }}>
              {typeof mensaje === 'string' ? mensaje : JSON.stringify(mensaje)}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Usuario"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.2, fontWeight: 'bold', fontSize: 16, borderRadius: 2, mb: 1 }}>
              Ingresar
            </Button>
          </form>
          {token && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              fullWidth
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Cerrar sesión
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
