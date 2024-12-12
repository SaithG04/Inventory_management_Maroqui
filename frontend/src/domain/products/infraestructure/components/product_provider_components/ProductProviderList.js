import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

const ProductProviderList = ({ relations, onEditRelation, onDeleteRelation }) => {
  console.log("Datos recibidos para la lista:", relations); // Debug: Verificar datos recibidos
  // Plantilla para la columna de acciones
  const actionBodyTemplate = (rowData) => (
    <div>
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-warning"
        onClick={() => onEditRelation(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => onDeleteRelation(rowData)}
        style={{ marginLeft: "0.5rem" }}
      />
    </div>
  );

  // Plantilla para la columna de precio (formato moneda)
  const priceBodyTemplate = (rowData) => (
    <span>${rowData.price.toFixed(2)}</span> // Asegúrate de que `price` sea un número
  );

  return (
    <div>
      <h3>Lista de Relaciones Producto-Proveedor</h3>
      <DataTable value={relations} responsiveLayout="scroll" paginator rows={10}>
        <Column field="productName" header="Producto"></Column>
        <Column field="providerName" header="Proveedor"></Column>
        <Column field="price" header="Precio" body={priceBodyTemplate}></Column>
        <Column body={actionBodyTemplate} header="Acciones"></Column>
      </DataTable>
    </div>
  );
};

export default ProductProviderList;
