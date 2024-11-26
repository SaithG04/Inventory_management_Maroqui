// src/components/EmployeeManagement/components/employee-search/EmployeeSearch.js
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import './EmployeeSearch.css';

const EmployeeSearch = ({ searchTerm, setSearchTerm, isActive, isInactive, setIsActive, setIsInactive, handleSearch, handleClearSearch }) => {
    return (
        <div className="employee-search-section">
            <div className="employee-search-input">
                <InputText
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-inputtext"
                />
            </div>
            <div className="employee-search-buttons">
                <Button label="Buscar" icon="pi pi-search" onClick={handleSearch} className="p-button-primary" />
                <Button label="Cancelar" icon="pi pi-times" onClick={handleClearSearch} className="p-button-secondary" />
            </div>
            <div className="employee-checkbox-group">
                <div className="employee-checkbox-item">
                    <Checkbox
                        inputId="active"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.checked)}
                    />
                    <label htmlFor="active">Activo</label>
                </div>
                <div className="employee-checkbox-item">
                    <Checkbox
                        inputId="inactive"
                        checked={isInactive}
                        onChange={(e) => setIsInactive(e.checked)}
                    />
                    <label htmlFor="inactive">Inactivo</label>
                </div>
            </div>
        </div>
    );
};

export default EmployeeSearch;
