import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

function LectorPanel({ catalogo = [], loading = false, error = '', setFeedback }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    setResultados(catalogo);
  }, [catalogo]);

  const handleBuscar = () => {
    let filtrados = catalogo;
    if (busqueda) {
      filtrados = filtrados.filter(pub =>
        pub.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        pub.resumen?.toLowerCase().includes(busqueda.toLowerCase()) ||
        pub.palabrasClave?.join(' ').toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    if (filtroTipo) {
      filtrados = filtrados.filter(pub => pub.tipo === filtroTipo);
    }
    setResultados(filtrados);
  };

  return (
    <div>
      <h2>Panel de Lector / Catálogo Público</h2>
      <ul>
        <li>Acceso al catálogo publicado</li>
        <li>Consulta de metadatos y búsqueda de publicaciones</li>
      </ul>
      <TextField
        label="Buscar por título, resumen o palabras clave"
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        size="small"
        sx={{ mr: 2, mb: 2, width: 300 }}
      />
      <TextField
        label="Filtrar por tipo"
        value={filtroTipo}
        onChange={e => setFiltroTipo(e.target.value)}
        select
        SelectProps={{ native: true }}
        size="small"
        sx={{ mr: 2, mb: 2, width: 180 }}
      >
        <option value="">Todos</option>
        <option value="ARTICULO">Artículo</option>
        <option value="LIBRO">Libro</option>
      </TextField>
      <Button variant="contained" onClick={handleBuscar} sx={{ mb: 2 }}>Buscar</Button>
      {loading && <CircularProgress sx={{ my: 2 }} />}
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
      <ul>
        {resultados.length === 0 && !loading && <li>No hay publicaciones disponibles.</li>}
        {resultados.map((pub, idx) => (
          <li key={idx} style={{marginBottom: 16}}>
            <strong>{pub.titulo}</strong> — {pub.autorPrincipal || ''} <br/>
            <span>{pub.resumen}</span><br/>
            <span>Tipo: {pub.tipo || 'N/A'} | Palabras clave: {pub.palabrasClave?.join(', ')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LectorPanel;
