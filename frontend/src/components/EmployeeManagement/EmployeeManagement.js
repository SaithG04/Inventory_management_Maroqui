// src/components/EmployeeManagement/EmployeeManagement.js
import React, { useState } from 'react';
import './EmployeeManagement.css';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    fullName: '',
    birthDate: '',
    address: '',
    phone: '',
    email: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [error, setError] = useState('');

  // Calcular la edad a partir de la fecha de nacimiento
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  // Manejar los cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  // Limpiar el formulario
  const handleClearForm = () => {
    setNewEmployee({
      fullName: '',
      birthDate: '',
      address: '',
      phone: '',
      email: '',
    });
    setIsEditing(false);
    setError('');
  };

  // Validar y registrar empleado
  const handleRegisterEmployee = () => {
    const { fullName, birthDate, address, phone, email } = newEmployee;

    if (!fullName || !birthDate || !address || !phone || !email) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    const age = calculateAge(birthDate);

    if (isEditing) {
      const updatedEmployees = employees.map(employee =>
        employee.id === editEmployeeId ? { ...employee, ...newEmployee, age } : employee
      );
      setEmployees(updatedEmployees);
      setIsEditing(false);
      setEditEmployeeId(null);
    } else {
      const newEmployeeEntry = {
        ...newEmployee,
        id: employees.length + 1,
        age,
      };
      setEmployees([...employees, newEmployeeEntry]);
    }

    handleClearForm(); // Limpiar el formulario después de registrar o editar
  };

  // Editar empleado
  const handleEditEmployee = (employee) => {
    setNewEmployee(employee);
    setIsEditing(true);
    setEditEmployeeId(employee.id);
  };

  // Eliminar empleado
  const handleDeleteEmployee = (id) => {
    const updatedEmployees = employees.filter(employee => employee.id !== id);
    setEmployees(updatedEmployees);
  };

  return (
    <div className="employee-management">
      <h2>Administrar Empleados</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="employee-form">
        <input
          type="text"
          name="fullName"
          placeholder="Nombres y Apellidos completos"
          value={newEmployee.fullName}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="birthDate"
          placeholder="Fecha de Nacimiento"
          value={newEmployee.birthDate}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Dirección de Domicilio"
          value={newEmployee.address}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Celular"
          value={newEmployee.phone}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          value={newEmployee.email}
          onChange={handleInputChange}
        />
        <div className="form-buttons">
          <button className="register-button" onClick={handleRegisterEmployee}>
            {isEditing ? 'Guardar Cambios' : 'Registrar Empleado'}
          </button>
          <button className="clear-button" onClick={handleClearForm}>
            Limpiar
          </button>
        </div>
      </div>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Nombres y Apellidos</th>
            <th>Fecha de Nacimiento</th>
            <th>Edad</th>
            <th>Dirección</th>
            <th>Celular</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.fullName}</td>
              <td>{employee.birthDate}</td>
              <td>{employee.age}</td>
              <td>{employee.address}</td>
              <td>{employee.phone}</td>
              <td>{employee.email}</td>
              <td>
                <button className="edit-button" onClick={() => handleEditEmployee(employee)}>Editar</button>
                <button className="delete-button" onClick={() => handleDeleteEmployee(employee.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
};

export default EmployeeManagement;
