import React from 'react';
import './Modal.css';
import { FaExclamationTriangle } from 'react-icons/fa'; // Importa el ícono de advertencia

const Modal = ({
  show,
  onClose,
  onConfirm,
  title = "Confirmación",
  message = "¿Estás seguro de que deseas continuar?",
  isLoading = false, // Nueva prop para manejar el estado de carga
}) => {
  if (!show) return null; // No renderiza nada si `show` es falso

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">{title}</h3>
        <div className="modal-body">
          <div className="modal-icon-wrapper">
            <FaExclamationTriangle className="warning-icon" /> {/* Icono de advertencia */}
          </div>
          <p className="modal-message">{message}</p>
        </div>
        <div className="modal-actions">
          <button
            className="modal-button cancel"
            onClick={onClose}
            disabled={isLoading} // Deshabilitar cancelar mientras está cargando
          >
            Cancelar
          </button>
          <button
            className={`modal-button aceptar ${isLoading ? 'loading' : ''}`} // Clase opcional para estilos de carga
            onClick={onConfirm}
            disabled={isLoading} // Deshabilitar el botón mientras está cargando
          >
            {isLoading ? 'Cargando...' : 'Aceptar'} {/* Mostrar "Cargando..." si está cargando */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
