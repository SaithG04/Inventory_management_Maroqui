// src/components/shared/modal/Modal.js
import React from 'react';
import './Modal.css';
import { FaExclamationTriangle } from 'react-icons/fa'; // Importa el ícono de advertencia

const Modal = ({ show, onClose, onConfirm, title = "Confirmación", message = "¿Estás seguro de que deseas continuar?" }) => {
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
          <button className="modal-button cancel" onClick={onClose}>Cancelar</button>
          <button className="modal-button aceptar" onClick={onConfirm}>Aceptar</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
