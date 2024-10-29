// src/components/MainContent/MainContent.js
import React from 'react';
import './MainContent.css';
import DashboardCard from '../DashboardCard/DashboardCard'; 
import Producto from '../Producto/Productos';
import Sales from '../Sales/Sales';
import EmployeeManagement from '../EmployeeManagement/EmployeeManagement';
import Supplier from '../Suppliers/Suppliers';

const MainContent = ({ activeSection }) => {
  return (
    <div className="main-content">
      {activeSection === 'dashboard' && <DashboardCard />}
      {activeSection === 'producto' && <Producto />}
      {activeSection === 'ventas' && <Sales />}
      {activeSection === 'empleados' && <EmployeeManagement />}
      {activeSection === 'suppliers' && <Supplier />}
    </div>
  );
};

export default MainContent;