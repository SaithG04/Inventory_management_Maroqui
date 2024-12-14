import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Resumen general de métricas y gráficos</p>
      </header>

      <section className="dashboard-metrics">
        {/* Aquí se mostrarán las tarjetas de métricas */}
      </section>

      <section className="dashboard-charts">
        <div className="chart-container">
          {/* Gráfico 1 (por ejemplo, barras) */}
        </div>
        <div className="chart-container">
          {/* Gráfico 2 (por ejemplo, líneas) */}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
