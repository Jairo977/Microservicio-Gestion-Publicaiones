import React, { useState } from 'react';

function Register() {
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    rol: 'AUTOR',
  });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const response = await fetch('http://localhost:8081/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        setMensaje('Usuario registrado exitosamente.');
        setForm({ nombres: '', apellidos: '', email: '', password: '', rol: 'AUTOR' });
      } else {
        const data = await response.json();
        setMensaje(data.message || 'Error al registrar usuario.');
      }
    } catch (error) {
      setMensaje('Error de conexión con el backend.');
    }
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombres"
          placeholder="Nombres"
          value={form.nombres}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          value={form.apellidos}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="rol" value={form.rol} onChange={handleChange}>
          <option value="AUTOR">Autor</option>
          <option value="REVISOR">Revisor</option>
          <option value="EDITOR">Editor</option>
          <option value="ADMIN">Admin</option>
          <option value="LECTOR">Lector</option>
        </select>
        <button type="submit">Registrarse</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default Register;
