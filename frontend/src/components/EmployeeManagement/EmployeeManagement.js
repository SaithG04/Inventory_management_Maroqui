// src/components/EmployeeManagement/EmployeeManagement.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import './EmployeeManagement.css';

const EmployeeManagement = () => {
  // Variables de estado
  const [employees, setEmployees] = useState([]);
  const newEmployeeRef = useRef(null);
  const searchInputRef = useRef(null); // Referencia para la caja de búsqueda
  const formInputRef = useRef(null);   // Referencia para el primer campo del formulario
  const toast = useRef(null); // Referencia para el Toast

  // Datos del formulario
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    id: '',
    fullName: '',
    email: '',
    password: '',
    role: '',
    status: 'Activo',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isInactive, setIsInactive] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [employeeToReset, setEmployeeToReset] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);

  // Datos iniciales de empleados
  useEffect(() => {
    const initialEmployeeData = () => [
      {
        id: 1,
        fullName: 'Teddy Alexander',
        email: 'admin@miroqui.es',
        password: 'password123',
        role: 'Administrador',
        status: 'Activo'
      },
      {
        id: 2,
        fullName: 'María López',
        email: 'vendedor@miroqui.es',
        password: 'vendedor123',
        role: 'Vendedor',
        status: 'Inactivo'
      },
      {
        id: 3,
        fullName: 'Carlos Sánchez',
        email: 'almacenero@miroqui.es',
        password: 'almacenero123',
        role: 'Almacenero',
        status: 'Activo'
      }
    ];
  
    const savedEmployees = localStorage.getItem('employees');
    if (!savedEmployees) {
      const initialEmployees = initialEmployeeData();
      localStorage.setItem('employees', JSON.stringify(initialEmployees));
      setEmployees(initialEmployees);
      setFilteredEmployees(initialEmployees);
    } else {
      try {
        const parsedEmployees = JSON.parse(savedEmployees);
        setEmployees(parsedEmployees);
        setFilteredEmployees(parsedEmployees);
      } catch (error) {
        console.error("Error al parsear los empleados desde localStorage:", error);
        localStorage.setItem('employees', JSON.stringify(initialEmployeeData()));
        setEmployees(initialEmployeeData());
        setFilteredEmployees(initialEmployeeData());
      }
    }
  }, []);

  // Guardar empleados en localStorage cada vez que `employees` cambie
  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem('employees', JSON.stringify(employees));
      console.log("Empleados actualizados en localStorage:", employees);
    }
  }, [employees]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (first >= filteredEmployees.length && filteredEmployees.length > 0) {
      setFirst(Math.max(0, filteredEmployees.length - rows));
    }
  }, [filteredEmployees.length, first, rows]);

  // Función para filtrar empleados según búsqueda y checkboxes
  const filterEmployees = useCallback(() => {
    let results = employees;
    if (isActive && !isInactive) {
      results = results.filter(employee => employee.status === 'Activo');
    } else if (!isActive && isInactive) {
      results = results.filter(employee => employee.status === 'Inactivo');
    }
    if (searchTerm) {
      results = results.filter(employee =>
        employee.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredEmployees(results);
  }, [employees, isActive, isInactive, searchTerm]);

  // Manejador de cambios para el campo de búsqueda
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Manejador de cambios para los campos del formulario de empleados
  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejadores de eventos
  const handleSearch = () => {
    filterEmployees();
  };

  const handleRowsChange = (newRows) => {
    setRows(newRows);
    setFirst(0); // Reinicia la primera página para evitar inconsistencias
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setIsActive(false);
    setIsInactive(false);
    setFilteredEmployees(employees);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleCheckboxChange = (e, filterType) => {
    if (filterType === 'active') {
      setIsActive(e.checked);
      if (e.checked) {
        setIsInactive(false); // Desmarcar el otro checkbox si este se selecciona
      }
    } else if (filterType === 'inactive') {
      setIsInactive(e.checked);
      if (e.checked) {
        setIsActive(false); // Desmarcar el otro checkbox si este se selecciona
      }
    }
  };

  const handleToggleForm = () => {
    if (
      newEmployee.fullName ||
      newEmployee.email ||
      newEmployee.password ||
      newEmployee.role !== ''
    ) {
      const confirmCancel = window.confirm(
        'Hay datos ingresados en el formulario. ¿Seguro que deseas cancelar?'
      );
      if (!confirmCancel) {
        return;
      }
    }

    setShowAddEmployeeForm((prev) => !prev);
    setIsEditing(false);
    setNewEmployee({
      id: '',
      fullName: '',
      email: '',
      password: '',
      role: '',
      status: 'Activo',
    });

    if (formInputRef.current) {
      formInputRef.current.focus();
    }
  };

const handleRegisterEmployee = () => {
    if (!newEmployee.fullName || !newEmployee.email || !newEmployee.password || !newEmployee.role) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    // Validar que el email termine con @miroqui.es
    if (!newEmployee.email.endsWith('@miroqui.es')) {
      alert('El correo debe terminar con "@miroqui.es".');
      return;
    }

    const employees = JSON.parse(localStorage.getItem('employees')) || [];

    // Si estamos en modo de edición
    if (isEditing) {
      const updatedEmployees = employees.map(emp =>
        emp.id === newEmployee.id ? newEmployee : emp
      );
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
      alert('Empleado actualizado con éxito.');
      setIsEditing(false);
    } else {
      // Si estamos creando un nuevo empleado
      const newId = employees.length > 0 ? employees[employees.length - 1].id + 1 : 1;
      const updatedEmployees = [...employees, { ...newEmployee, id: newId }];
      localStorage.setItem('employees', JSON.stringify(updatedEmployees)); // Guardar en localStorage
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
      alert('Empleado registrado con éxito.');
    }

    setShowAddEmployeeForm(false);
    setNewEmployee({
      id: '',
      fullName: '',
      email: '',
      password: '',
      role: '',
      status: 'Activo',
    });
};


  const handleEditEmployee = (employee) => {
    setNewEmployee(employee);
    setIsEditing(true);
    setShowAddEmployeeForm(true);
  };

  const handleToggleEmployeeStatus = (employee) => {
    const updatedEmployees = employees.map(emp =>
      emp.id === employee.id
        ? { ...emp, status: emp.status === 'Activo' ? 'Inactivo' : 'Activo' }
        : emp
    );
    setEmployees(updatedEmployees);
    setFilteredEmployees(updatedEmployees);
    toast.current.show({ severity: 'info', summary: 'Estado Actualizado', detail: `El estado de ${employee.fullName} ha sido cambiado.`, life: 3000 });
  };

  const handleResetPassword = (employee) => {
    setEmployeeToReset(employee);
    setShowResetPasswordForm(true);
    setNewPassword('');
  };

  const handleSaveNewPassword = () => {
    if (!newPassword) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, ingrese una nueva contraseña.', life: 3000 });
      return;
    }

    const updatedEmployees = employees.map(emp =>
      emp.id === employeeToReset.id ? { ...emp, password: newPassword } : emp
    );

    setEmployees(updatedEmployees);
    setFilteredEmployees(updatedEmployees);
    setShowResetPasswordForm(false);
    toast.current.show({ severity: 'success', summary: 'Contraseña Actualizada', detail: `La contraseña de ${employeeToReset.fullName} ha sido actualizada.`, life: 3000 });
  };

  const maskPassword = (password) => {
    return '•'.repeat(password.length);
  };

  return (
    <div className="employee-management">
      <Toast ref={toast} />

      {/* Encabezado */}
      <div className="employee-header">
        <h2>Administrar Empleados</h2>
      </div>

      {/* Sección de Búsqueda */}
      <div className="employee-search-section">
        <div className="employee-search-input">
          <InputText
            ref={searchInputRef}
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
        </div>
        <div className="employee-search-buttons">
          <Button label="Buscar" icon="pi pi-search" onClick={handleSearch} className='p-button-primary' />
          <Button label="Cancelar" icon="pi pi-times" onClick={handleClearSearch} className="p-button-secondary" />
        </div>

        <div className="employee-checkbox-group">
          <div className="employee-checkbox-item">
            <Checkbox
              inputId="active"
              checked={isActive}
              onChange={e => handleCheckboxChange(e, 'active')}
            />
            <label htmlFor="active">Activo</label>
          </div>
          <div className="employee-checkbox-item">
            <Checkbox
              inputId="inactive"
              checked={isInactive}
              onChange={e => handleCheckboxChange(e, 'inactive')}
            />
            <label htmlFor="inactive">Inactivo</label>
          </div>
        </div>
      </div>

      {/* Botón para Mostrar/Ocultar Formulario */}
      <div className="employee-toggle-form">
        <Button
          label={showAddEmployeeForm ? 'Cancelar' : 'Crear Nuevo Empleado'}
          icon={showAddEmployeeForm ? 'pi pi-times' : 'pi pi-plus'}
          onClick={handleToggleForm}
          className={showAddEmployeeForm ? 'p-button-danger' : 'p-button-success'}
        />
      </div>

      {/* Formulario de Agregar/Editar Empleado */}
      {showAddEmployeeForm && (
        <div className="employee-add-form">
          <h3>{isEditing ? 'Editar Empleado' : 'Crear Nuevo Empleado'}</h3>
          <div className="employee-form-row">
            <InputText
              type="text"
              name="fullName"
              placeholder="Nombres completos"
              value={newEmployee.fullName}
              onChange={handleFormInputChange}
              ref={newEmployeeRef}
            />
            <InputText
              type="email"
              name="email"
              placeholder="Correo Electrónico Corporativo"
              value={newEmployee.email}
              onChange={handleFormInputChange}
            />
          </div>
          <div className="employee-form-row">
            {!isEditing && (
              <InputText
                type="password"
                name="password"
                placeholder="Contraseña"
                value={newEmployee.password}
                onChange={handleFormInputChange}
              />
            )}
            <select name="role" value={newEmployee.role} onChange={handleFormInputChange}>
              <option value="" disabled>Seleccione un rol</option>
              <option value="Administrador">Administrador</option>
              <option value="Almacenero">Almacenero</option>
              <option value="Vendedor">Vendedor</option>
            </select>
          </div>
          <div className="add-employee-section">
            <Button
              label={isEditing ? 'Guardar Cambios' : 'Registrar Empleado'}
              icon="pi pi-check"
              onClick={handleRegisterEmployee}
              className="add-button add"
            />
          </div>
        </div>
      )}

      {/* Formulario de Restablecimiento de Contraseña */}
      {showResetPasswordForm && (
        <div className="employee-reset-password-form">
          <h3>Restablecer Contraseña para {employeeToReset.fullName}</h3>
          <InputText
            type="password"
            placeholder="Nueva Contraseña"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <div className="employee-button-group">
            <Button
              label="Guardar Nueva Contraseña"
              icon="pi pi-check"
              onClick={handleSaveNewPassword}
              className="p-button p-button-success"
            />
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setShowResetPasswordForm(false)}
              className="p-button p-button-secondary"
            />
          </div>
        </div>
      )}

      <DataTable
        value={filteredEmployees}
        paginator
        rows={rows}
        rowsPerPageOptions={[5, 10, 25]}
        totalRecords={filteredEmployees.length}
        first={first}
        onPage={(e) => {
          handleRowsChange(e.rows);
          setFirst(e.first);
        }}
        responsiveLayout="scroll"
        className="employee-table"
      >
        <Column field="fullName" header="Nombres completos" sortable headerClassName="center-header" bodyClassName="center-body" />
        <Column field="email" header="Correo Electrónico" headerClassName="center-header" bodyClassName="center-body" />
        <Column field="password" header="Contraseña" body={rowData => maskPassword(rowData.password)} headerClassName="center-header" bodyClassName="center-body" />
        <Column field="role" header="Rol" sortable headerClassName="center-header" bodyClassName="center-body" />
        <Column field="status" header="Estatus" sortable headerClassName="center-header" bodyClassName="center-body" />
        <Column
          body={rowData => (
            <div className="employee-button-container">
              <Button
                label="Editar"
                icon="pi pi-pencil"
                onClick={() => handleEditEmployee(rowData)}
                className="employee-button employee-button-edit"
              />
              <Button
                label={rowData.status === 'Activo' ? 'Desactivar' : 'Activar'}
                icon="pi pi-user-edit"
                onClick={() => handleToggleEmployeeStatus(rowData)}
                className="employee-button employee-button-toggle-status"
              />
              <Button
                label="Restablecer"
                icon="pi pi-refresh"
                onClick={() => handleResetPassword(rowData)}
                className="employee-button employee-button-reset-password"
              />
            </div>
          )}
          headerClassName="center-header"
          bodyClassName="center-body"
        />
      </DataTable>
    </div>
  );
};

export default EmployeeManagement;
