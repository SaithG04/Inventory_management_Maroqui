// src/components/EmployeeManagement/components/employee-form/EmployeeForm.js
import React, { useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './EmployeeForm.css';

const EmployeeForm = ({ newEmployee, setNewEmployee, isEditing, handleRegisterEmployee, handleToggleForm }) => {
    const newEmployeeRef = useRef(null);

    useEffect(() => {
        if (newEmployeeRef.current) {
            newEmployeeRef.current.focus();
        }
    }, []);

    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
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
                <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    onClick={handleToggleForm}
                    className="cancel-button"
                />
            </div>
        </div>
    );
};

export default EmployeeForm;
