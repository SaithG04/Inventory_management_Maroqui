import React from "react";
import { DataTable } from "primereact/datatable"; // Importación del componente DataTable de PrimeReact
import { Column } from "primereact/column"; // Importación del componente Column de PrimeReact
import { Button } from "primereact/button"; // Importación del componente Button de PrimeReact
import "./ProviderList.css"; // Importación de los estilos para la lista de proveedores

// Componente ProviderList
const ProviderList = ({ providers, onEditProvider, onDeleteProvider }) => {
  return (
    <div className="provider-list"> {/* Contenedor principal de la lista de proveedores */}
      
      {/* Componente DataTable para mostrar la lista de proveedores */}
      <DataTable
        value={providers} // Los datos de los proveedores se pasan como prop
        paginator // Habilitar paginación para los datos
        rows={10} // Número de filas por página
        responsiveLayout="scroll" // Hacer que la tabla sea responsiva y se desplace si es necesario
        emptyMessage="No hay proveedores disponibles." // Mensaje cuando no hay proveedores para mostrar
      >

        {/* Columna para mostrar el nombre del proveedor */}
        <Column field="name" header="Nombre" sortable /> 

        {/* Columna para mostrar el contacto del proveedor */}
        <Column field="contact" header="Contacto" sortable />

        {/* Columna para mostrar el teléfono del proveedor */}
        <Column field="phone" header="Teléfono" sortable />

        {/* Columna para mostrar el correo electrónico del proveedor */}
        <Column field="email" header="Correo Electrónico" sortable />

        {/* Columna para mostrar la dirección del proveedor */}
        <Column field="address" header="Dirección" />

        {/* Columna para mostrar las condiciones del proveedor */}
        <Column field="conditions" header="Condiciones" sortable />

        {/* Columna para mostrar el estado del proveedor */}
        <Column field="state" header="Estado" />

        {/* Columna personalizada para mostrar los botones de acción */}
        <Column
          body={(rowData) => (
            <div className="providers-button-container"> {/* Contenedor para los botones de acción */}
              
              {/* Botón para editar proveedor */}
              <Button
                icon="pi pi-pencil" // Icono de lápiz para editar
                label="Editar" // Etiqueta del botón
                className="providers-button-edit" // Clase CSS para el botón de editar
                onClick={() => onEditProvider(rowData.id)} // Llama a la función onEditProvider con el id del proveedor
              />
              
              {/* Botón para eliminar proveedor */}
              <Button
                icon="pi pi-trash" // Icono de papelera para eliminar
                label="Eliminar" // Etiqueta del botón
                className="providers-button-delete" // Clase CSS para el botón de eliminar
                onClick={() => onDeleteProvider(rowData.id)} // Llama a la función onDeleteProvider con el id del proveedor
              />
            </div>
          )}
          header="Acciones" // Título de la columna de acciones
        />
      </DataTable>
    </div>
  );
};

// Exporta el componente ProviderList para que se pueda usar en otras partes de la aplicación
export default ProviderList;
