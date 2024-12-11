import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import "./ProviderList.css";

const ProviderList = ({ providers, onEditProvider, onDeleteProvider }) => {
  return (
    <div className="provider-list">
      {/* Tabla de proveedores */}
      <DataTable value={providers} paginator rows={10} responsiveLayout="scroll">
        <Column field="name" header="Name" sortable />
        <Column field="contact" header="Contact" sortable />
        <Column field="phone" header="Phone" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="address" header="Address" />
        <Column field="conditions" header="Conditions" sortable />
        <Column field="state" header="Status" />
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
          header="Actions"
        />
      </DataTable>
    </div>
  );
};

export default ProviderList;
