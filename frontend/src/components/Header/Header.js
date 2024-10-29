// Importar las dependencias necesarias
import React from 'react';
import './Header.css'; // Importar los estilos para el encabezado
import Logo from '../../assets/logo.png';

// Componente funcional para el encabezado
const Header = () => {
    return (
        <header className="header-wrapper">
            <div className="header-container">
                <img src={Logo} alt="Comercial Hiroqui Logo" className="header-logo" />
            </div>
            
        </header>
    );
};

export default Header; // Exportar el componente para poder ser utilizado en otras partes de la aplicación
