// src/components/EmployeeManagement/components/employee-table/EmployeeTable.js
import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './EmployeeTable.css';

const EmployeeTable = ({ employees, first, rows, onPageChange, handleEditEmployee, handleToggleEmployeeStatus, handleResetPassword }) => {
    return (
        <DataTable
            value={employees}
            paginator
            rows={rows}
            rowsPerPageOptions={[5, 10, 25]}
            totalRecords={employees.length}
            first={first}
            onPage={onPageChange}
            responsiveLayout="scroll"
            className="employee-table"
        >
            <Column field="fullName" header="Nombres completos" sortable headerClassName="center-header" bodyClassName="center-body" />
            <Column field="email" header="Correo Electrónico" headerClassName="center-header" bodyClassName="center-body" />
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
    );
};

export default EmployeeTable;
