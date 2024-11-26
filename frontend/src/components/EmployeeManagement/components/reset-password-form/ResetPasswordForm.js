// src/components/EmployeeManagement/components/reset-password-form/ResetPasswordForm.js
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './ResetPasswordForm.css';

const ResetPasswordForm = ({ employeeToReset, newPassword, setNewPassword, handleSaveNewPassword, setShowResetPasswordForm }) => {
    return (
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
    );
};

export default ResetPasswordForm;
