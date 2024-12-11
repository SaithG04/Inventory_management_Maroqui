import React from 'react';
import ReactDOM from 'react-dom/client'; // Cambia 'react-dom' por 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Obtén la raíz del DOM donde se montará tu aplicación
const rootElement = document.getElementById('root');

// Crea la raíz de React
const root = ReactDOM.createRoot(rootElement);

// Renderiza la aplicación
root.render(
    <React.StrictMode>
        <Router>
            <App />
            <ToastContainer />
        </Router>
    </React.StrictMode>
);
