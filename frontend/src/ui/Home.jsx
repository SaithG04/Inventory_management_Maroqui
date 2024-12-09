import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../js/urlHelper';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        email,
        password,
      });
      console.log('Respuesta de la API:', response.data);
      // Maneja el token o redirección aquí si es necesario
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMessage('Credenciales incorrectas, por favor intente nuevamente.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-blue-400">
      <div className="bg-white shadow-lg rounded-lg flex w-11/12 max-w-5xl">

      {/* Imagen / Logo */}
      <div className="w-full sm:w-1/2 p-12 flex flex-col items-center justify-center bg-gradient-to-t from-yellow-200 to-green-300">
        <img
          src="/img/logo.png"
          alt="Comercial Hiroqui"
          className="w-56 h-auto mb-8" // Aumentado el tamaño del logo
        />
        <h2 className="text-2xl font-extrabold text-gray-700">Equipando tus ideas</h2> {/* Tamaño de texto aumentado */}
      </div>

        {/* Formulario de Login */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">¡Bienvenido, digite credenciales!</h2>
          {errorMessage && (
            <div className="mb-6 text-red-600 font-semibold">{errorMessage}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-3">
                Correo electrónico
              </label>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <span className="px-4 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 5.75l8.25 5.5 8.25-5.5m-16.5 0a2.25 2.25 0 00-2.25 2.25v8.5a2.25 2.25 0 002.25 2.25h16.5a2.25 2.25 0 002.25-2.25v-8.5a2.25 2.25 0 00-2.25-2.25m-16.5 0L12 11.25m0 0l8.25-5.5"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 focus:outline-none"
                  placeholder="Ej. corporativo@miroqui.es"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-3">
                Contraseña
              </label>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <span className="px-4 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V9a4.5 4.5 0 10-9 0v1.5m-3 0A2.25 2.25 0 006.75 12v6a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-6a2.25 2.25 0 00-2.25-2.25m-12 0h12"
                    />
                  </svg>
                </span>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-3 focus:outline-none"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring focus:ring-teal-300"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;