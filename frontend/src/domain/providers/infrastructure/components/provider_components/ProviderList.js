import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import "./ProviderList.css";

const ProviderList = ({ providers, onEditProvider, onDeleteProvider }) => {
  return (
    <div className="provider-list">
      {/* Tabla de proveedores */}
      <DataTable
        value={providers}
        paginator
        rows={10}
        responsiveLayout="scroll"
        emptyMessage="No hay proveedores disponibles." // Mensaje en español
      >
        <Column field="name" header="Nombre" sortable /> {/* Traducción del encabezado */}
        <Column field="contact" header="Contacto" sortable />
        <Column field="phone" header="Teléfono" sortable />
        <Column field="email" header="Correo Electrónico" sortable />
        <Column field="address" header="Dirección" />
        <Column field="conditions" header="Condiciones" sortable />
        <Column field="state" header="Estado" />
        <Column
          body={(rowData) => (
            <div className="providers-button-container">
              <Button
                icon="pi pi-pencil"
                label="Editar"
                className="providers-button-edit"
                onClick={() => onEditProvider(rowData.id)} // Llama a la función de edición
              />
              <Button
                icon="pi pi-trash"
                label="Eliminar"
                className="providers-button-delete"
                onClick={() => onDeleteProvider(rowData.id)} // Llama a la función de eliminar
              />
            </div>
          )}
          header="Acciones" // Traducción del encabezado
        />
      </DataTable>
    </div>
  );
};

export default ProviderList;
