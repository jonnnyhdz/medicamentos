import React from 'react';
import { Navbar, Button } from 'react-bootstrap';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Cerrar sesión exitosamente, redirigir al componente de inicio de sesión
        navigate('/');
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand>MEDICAMENTOS</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse className="justify-content-end">
        <Button variant="outline-danger" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
