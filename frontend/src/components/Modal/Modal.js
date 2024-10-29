// src/components/Modal/Modal.js
import React from 'react';
import './Modal.css';

const Modal = ({ show, onClose, onConfirm }) => {
  if (!show) return null; // No renderiza nada si `show` es falso

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Confirmación</h3>
        <p>¿Estás seguro de que deseas salir?</p>
        <div className="modal-actions">
          <button className="modal-button" onClick={onConfirm}>Sí</button>
          <button className="modal-button" onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
