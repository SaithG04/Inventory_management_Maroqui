import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './SupplierTable.css';

const SupplierTable = ({ suppliers, onEdit, onDelete }) => {
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="action-buttons">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-info"
                    onClick={() => onEdit(rowData)}
                    tooltip="Editar"
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    onClick={() => onDelete(rowData.id)}
                    tooltip="Eliminar"
                />
            </div>
        );
    };

    return (
        <div className="supplier-table">
            <DataTable
                value={suppliers}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 20]}
                responsiveLayout="scroll"
                header="Listado de Proveedores"
            >
                <Column field="name" header="Nombre" sortable />
                <Column field="contact" header="Contacto" sortable />
                <Column field="phone" header="Teléfono" sortable />
                <Column field="email" header="Correo" sortable />
                <Column field="address" header="Dirección" />
                <Column field="status" header="Estado" sortable />
                <Column body={actionBodyTemplate} header="Acciones" />
            </DataTable>
        </div>
    );
};

export default SupplierTable;
