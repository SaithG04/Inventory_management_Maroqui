import React, { useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

const ProductProviderList = ({ relations, onEditRelation, onDeleteRelation }) => {
  console.log("Datos recibidos para la lista:", relations);

  const actionBodyTemplate = useCallback(
    (rowData) => (
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
    ),
    [onEditRelation, onDeleteRelation]
  );

  const priceBodyTemplate = useCallback(
    (rowData) => <span>${rowData.price.toFixed(2)}</span>,
    []
  );

  return (
    <div>
      <h3>Lista de Relaciones Producto-Proveedor</h3>
      <DataTable value={relations} responsiveLayout="scroll" paginator rows={10}>
        <Column field="productName" header="Producto" />
        <Column field="providerName" header="Proveedor" />
        <Column field="price" header="Precio" body={priceBodyTemplate} />
        <Column body={actionBodyTemplate} header="Acciones" />
      </DataTable>
    </div>
  );
};

export default ProductProviderList;
