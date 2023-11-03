import React from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import FacebookLogin from 'react-facebook-login';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90vh',
  },
  card: {
    width: '400px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  h1: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

const LoginForm = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        navigate('/MedicationChart');
      })
      .catch((error) => {
        console.error('Error al iniciar sesión con Google:', error);
      });
  };

  const responseFacebook = (response) => {
    console.log(response); // Puedes agregar tu lógica de inicio de sesión con Facebook aquí
  };

  return (
    <div style={styles.container} className="mt-5">
      <div className="row">
        <div className="col-md-6">
          <div style={styles.card} className="card">
            <div className="card-body">
              <h1 style={styles.h1} className="display-6 mb-4">
                CALENDARASETAMOL
              </h1>
              <form>
                <div className="form-group">
                  <label htmlFor="email">Correo Electrónico</label>
                  <input
                    type="email"
                    style={styles.input}
                    id="email"
                    placeholder="Ingresa tu correo electrónico"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    style={styles.input}
                    id="password"
                    placeholder="Ingresa tu contraseña"
                  />
                </div>
                <button
                  type="submit"
                  style={styles.button}
                  className="btn btn-primary btn-lg btn-block mt-3"
                >
                  Ingresar
                </button>
              </form>
              <h5 className="mt-4">Ingresa con:</h5>
              <div className="text-center mt-3">
                <div>
                  <img
                    src="https://icones.pro/wp-content/uploads/2021/02/google-icone-symbole-logo-png.png"
                    alt="Ingresar con Google"
                    onClick={handleGoogleSignIn}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '50%',
                      width: '80px',
                      height: '80px',
                      marginRight: '10px',
                    }}
                  />
                </div>
                <div>
                  <FacebookLogin
                    appId="849791220077330"
                    autoLoad={false}
                    fields="name, email"
                    callback={responseFacebook}
                    cssClass="facebook-login-button"
                  />
                </div>
              </div>
              <p className="mt-4">
                ¿Todavía no tienes una cuenta?{' '}
                <a href="/registro" className="text-primary font-weight-bold">
                  Crea una cuenta
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <img
            src="https://png.pngtree.com/png-vector/20230728/ourlarge/pngtree-medication-clipart-cartoon-smiling-medicine-bottles-with-pills-vector-png-image_6811907.png"
            alt=""
            className="w-100 h-100 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
