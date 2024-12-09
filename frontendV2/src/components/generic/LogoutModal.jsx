// src/components/shared/modal/LogoutModal.jsx
import React from 'react';

const LogoutModal = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) return null; // Si no se debe mostrar el modal, no renderizar nada

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-lg mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
