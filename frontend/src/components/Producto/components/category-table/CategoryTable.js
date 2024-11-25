import React from 'react';
import { DataTable } from 'primereact/datatable'; // Importa DataTable desde PrimeReact
import { Column } from 'primereact/column'; // Importa Column desde PrimeReact
import { Button } from 'primereact/button'; // Importa Button desde PrimeReact
import './CategoryTable.css'; // Importa los estilos personalizados para CategoryTable

const CategoryTable = ({ categories, handleEdit, handleDelete }) => {
    // Función para traducir el estado
    const traducirEstado = (estado) => {
        switch (estado) {
            case 'ACTIVE':
                return 'ACTIVO';
            case 'INACTIVE':
                return 'INACTIVO';
            default:
                return estado; // Si no hay mapeo, devolver el estado original
        }
    };

    return (
        <div>
            <DataTable value={categories} className="category-table" paginator rows={10}>
                <Column field="nombre" header="Nombre" sortable />
                <Column field="descripcion" header="Descripción" />
                <Column
                    field="estado"
                    header="Estado"
                    body={(rowData) => traducirEstado(rowData.estado)}
                    sortable
                />
                <Column
                    body={(rowData) => (
                        <div className="category-button-container">
                            <Button
                                icon="pi pi-pencil"
                                className="category-button-edit"
                                onClick={() => handleEdit(rowData)}
                                label="Editar"
                            />
                            <Button
                                icon="pi pi-trash"
                                className="category-button-delete"
                                onClick={() => handleDelete(rowData.id_categoria)}
                                label="Eliminar"
                            />
                        </div>
                    )}
                />
            </DataTable>
        </div>
    );
};

export default CategoryTable;
