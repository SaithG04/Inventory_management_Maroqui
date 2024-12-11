// src/components/Statistics/Statistics.js
import React from 'react';
import './Statistics.css';

const Statistics = () => {
  return (
    <div className="statistics">
      <div className="storage-info">
        <h4>Storage</h4>
        {/* Aquí puedes agregar una gráfica circular */}
        <p>37% Used</p>
      </div>
      <div className="last-file">
        <h4>Last File</h4>
        {/* Aquí puedes listar los archivos recientes */}
        <p>File Name</p>
      </div>
    </div>
  );
};

export default Statistics;
