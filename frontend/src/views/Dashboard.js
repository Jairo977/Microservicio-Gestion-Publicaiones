import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AutorPanel from './AutorPanel';
import RevisorPanel from './RevisorPanel';
import EditorPanel from './EditorPanel';
import LectorPanel from './LectorPanel';
import NotificacionesPanel from './NotificacionesPanel';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

function Dashboard() {
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol');
  const token = localStorage.getItem('token');
  const [catalogo, setCatalogo] = useState([]);
  const [catalogoLoading, setCatalogoLoading] = useState(false);
  const [catalogoError, setCatalogoError] = useState('');
  // Función para mostrar mensajes de feedback global
  const [feedback, setFeedback] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuItems = [
    // { text: 'Usuarios', path: '/usuarios', desc: 'Administra los usuarios del sistema, sus roles y credenciales.' },
    { text: 'Autores', path: '/autores', desc: 'Gestiona los autores registrados y su información académica.' },
    { text: 'Publicaciones', path: '/publicaciones', desc: 'Crea, edita y elimina publicaciones académicas y libros.' },
    { text: 'Notificaciones', path: '/notificaciones', desc: 'Envía y visualiza notificaciones del sistema.' },
    { text: 'Catálogo', path: '/catalogo', desc: 'Consulta el catálogo público de publicaciones.' },
  ];
  const [selectedDesc, setSelectedDesc] = useState('Bienvenido al sistema de gestión integral de publicaciones. Selecciona un módulo en el menú lateral.');

  // Elimina la validación de expiración de token (JWT)
  useEffect(() => {
    if (!token) {
      setFeedback('Debes iniciar sesión.');
      setTimeout(() => {
        setFeedback('');
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        navigate('/login');
      }, 2000);
    } else if (rol === 'ADMIN') {
      navigate('/admin');
    }
  }, [token, rol, navigate]);

  // Cargar catálogo solo para LECTOR
  useEffect(() => {
    if (rol === 'LECTOR') {
      setCatalogoLoading(true);
      fetch('http://localhost:8083/catalogo/publicaciones')
        .then((res) => {
          if (!res.ok) throw new Error('Error al obtener catálogo');
          return res.json();
        })
        .then((data) => {
          setCatalogo(data);
          setCatalogoLoading(false);
        })
        .catch(() => {
          setCatalogoError('No se pudo cargar el catálogo.');
          setCatalogoLoading(false);
        });
    }
  }, [rol]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    setFeedback('Sesión cerrada correctamente.');
    setTimeout(() => {
      setFeedback('');
      navigate('/login');
    }, 1500);
  };

  const handleMenuClick = (item) => {
    setSelectedDesc(item.desc);
    navigate(item.path);
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', display: 'flex' }}>
      {/* AppBar superior */}
      <AppBar position="fixed" sx={{ zIndex: 1201, bgcolor: '#1e293b', color: '#fff', boxShadow: 3 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
            Panel de Administración
          </Typography>
          <Button color="inherit" variant="outlined" onClick={handleLogout} sx={{ borderColor: '#fff', ml: 2 }}>
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>
      {/* Drawer lateral */}
      <Drawer
        variant="permanent"
        sx={{ width: 220, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 220, boxSizing: 'border-box', bgcolor: '#1e293b', color: '#fff', pt: 8 } }}
        open={sidebarOpen}
      >
        <Toolbar />
        <List>
          {menuItems.map((item, idx) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => handleMenuClick(item)} sx={{ '&:hover': { bgcolor: '#334155' } }}>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 'bold', fontSize: 16 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      {/* Contenido principal */}
      <Box sx={{ flexGrow: 1, ml: 28, mt: 10, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 2, minHeight: '80vh' }}>
        <Typography variant="h5" sx={{ mb: 2, color: '#1e293b', fontWeight: 'bold' }}>{selectedDesc}</Typography>
        {feedback && <Alert severity="error" sx={{ mb: 2 }}>{feedback}</Alert>}
        {(rol === 'ADMIN') && (
          <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => navigate('/admin')}>Panel de Administración</Button>
        )}
        <NotificacionesPanel />
        {/* Paneles diferenciados por rol con consumo real de datos */}
        {rol === 'AUTOR' && <AutorPanel setFeedback={setFeedback} />}
        {rol === 'REVISOR' && <RevisorPanel setFeedback={setFeedback} />}
        {(rol === 'EDITOR' || rol === 'ADMIN') && <EditorPanel setFeedback={setFeedback} />}
        {rol === 'LECTOR' && (
          <div>
            <LectorPanel catalogo={catalogo} loading={catalogoLoading} error={catalogoError} setFeedback={setFeedback} />
          </div>
        )}
        {!['AUTOR','REVISOR','EDITOR','ADMIN','LECTOR'].includes(rol) && (
          <Alert severity="warning">Rol no autorizado.</Alert>
        )}
      </Box>
    </Box>
  );
}

export default Dashboard;
