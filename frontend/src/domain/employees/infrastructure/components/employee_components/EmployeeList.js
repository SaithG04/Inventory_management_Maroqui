import React, { useRef, useState } from "react"; // Importa React junto con los hooks `useRef` y `useState`.
import { DataTable } from "primereact/datatable"; // Componente de tabla interactiva de PrimeReact.
import { Column } from "primereact/column"; // Componente de columna para `DataTable`.
import { Button } from "primereact/button"; // Componente de botón de PrimeReact.
import { Toast } from "primereact/toast"; // Componente para mostrar notificaciones tipo toast.
import Modal from "../../../../../infrastructure/shared/modal/Modal"; // Componente de modal personalizado.
import "./EmployeeList.css"; // Estilos específicos para este componente.


const EmployeeList = ({ employees, onEditEmployee, onResetPassword, onToggleStatus }) => {
  const toast = useRef(null); // Referencia para mostrar notificaciones (Toast).
  const [isModalVisible, setIsModalVisible] = useState(false); // Controla la visibilidad del modal.
  const [currentEmployee, setCurrentEmployee] = useState(null); // Almacena el empleado seleccionado para confirmar acciones.


  const handleToggleStatus = async (employeeId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? false : true; // Convertir estado a booleano.
    try {
      await onToggleStatus(employeeId, newStatus); // Llama la función para cambiar el estado.
      toast.current.show({
        severity: "success",
        summary: "Estado Actualizado",
        detail: `El estado del empleado se cambió a ${newStatus ? "Activo" : "Bloqueado"}.`,
        life: 3000,
      });
    } catch (error) {
      console.error("Error al cambiar el estado del empleado:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo cambiar el estado del empleado.",
        life: 3000,
      });
    }
  };

  const confirmToggleStatus = (employee) => {
    setCurrentEmployee(employee); // Establece el empleado actual seleccionado.
    setIsModalVisible(true); // Muestra el modal para confirmar la acción.
  };

  const handleConfirmToggleStatus = () => {
    if (currentEmployee) {
      handleToggleStatus(currentEmployee.idUser, currentEmployee.status); // Cambia el estado del empleado.
      setIsModalVisible(false); // Oculta el modal tras la acción.
    }
  };

  return (
    <section className="employee-list-section">
      {/* Toast para mostrar notificaciones al usuario (éxito o error) */}
      <Toast ref={toast} />

      <div className="employee-list">
        {/* Componente DataTable para mostrar la lista de empleados */}
        <DataTable
          value={employees} // Propiedad que contiene la lista de empleados a renderizar en la tabla.
          paginator // Habilita la paginación en la tabla.
          rows={10} // Configura la cantidad de filas mostradas por página.
          responsiveLayout="scroll" // Permite que la tabla sea desplazable en dispositivos pequeños.
          emptyMessage="No se encontraron empleados." // Mensaje que aparece cuando no hay empleados en la lista.
        >
          {/* Columnas definidas para cada campo de los empleados */}

          {/* Columna para el nombre del empleado */}
          <Column field="firstName" header="Nombre" sortable />

          {/* Columna para el apellido del empleado */}
          <Column field="lastName" header="Apellido" sortable />

          {/* Columna para el correo electrónico del empleado */}
          <Column field="email" header="Correo Electrónico" sortable />

          {/* Columna para el DNI del empleado */}
          <Column field="dni" header="DNI" sortable />

          {/* Columna para la edad del empleado */}
          <Column field="age" header="Edad" sortable />

          {/* Columna para la fecha de nacimiento */}
          <Column
            field="birthDate"
            header="Fecha de Nacimiento"
            body={(rowData) => rowData.birthDate || "N/A"} // Si no hay fecha de nacimiento, muestra "N/A".
          />

          {/* Columna para la dirección del empleado */}
          <Column field="address" header="Dirección" sortable />

          {/* Columna para el teléfono del empleado */}
          <Column field="phone" header="Teléfono" sortable />

          {/* Columna para el sexo del empleado */}
          <Column field="sex" header="Sexo" sortable />

          {/* Columna para el estado civil del empleado */}
          <Column field="maritalStatus" header="Estado Civil" sortable />

          {/* Columna para el rol del empleado */}
          <Column
            field="roles"
            header="Rol"
            body={(rowData) =>
              Array.isArray(rowData.roles)
                ? rowData.roles.join(", ") // Si el campo "roles" es un array, une los elementos con una coma.
                : "N/A" // Si no hay roles, muestra "N/A".
            }
          />

          <Column
            // Define una columna en la tabla para mostrar el estado del empleado (Activo o Inactivo)
            field="status" // Campo que se mapea desde los datos del empleado
            header="Estado" // Encabezado de la columna
            body={(rowData) => (
              // Renderiza un span con una clase dinámica para mostrar visualmente el estado
              <span className={`status-pill ${rowData.status?.toLowerCase()}`}>
                {/* Traduce el estado al idioma del sistema */}
                {rowData.status === "ACTIVE" ? "Activo" : "Inactivo"}
              </span>
            )}
            sortable // Permite ordenar la tabla por este campo
          />
          <Column
            // Define una columna para las acciones disponibles por cada empleado
            header="Acciones" // Encabezado de la columna
            body={(rowData) => (
              // Contenedor que incluye botones de acción
              <div className="employee-button-container">
                {/* Botón para editar los datos del empleado */}
                <Button
                  icon="pi pi-pencil" // Icono de lápiz
                  label="Editar" // Etiqueta del botón
                  className="employee-button-edit" // Clase CSS para estilo personalizado
                  onClick={() => onEditEmployee(rowData)} // Llama a la función para editar el empleado
                />
                {/* Botón para cambiar el estado del empleado (bloquear/activar) */}
                <Button
                  icon={rowData.status === "ACTIVE" ? "pi pi-lock" : "pi pi-unlock"} // Icono dinámico: candado cerrado o abierto
                  label={rowData.status === "ACTIVE" ? "Bloquear" : "Activar"} // Etiqueta dinámica según el estado
                  className="employee-button-toggle-status" // Clase CSS para estilo personalizado
                  onClick={() => confirmToggleStatus(rowData)} // Llama a la función para confirmar el cambio de estado
                />
                {/* Botón para restablecer la contraseña del empleado */}
                <Button
                  icon="pi pi-refresh" // Icono de refresco
                  label="Restablecer" // Etiqueta del botón
                  className="employee-button-reset-password" // Clase CSS para estilo personalizado
                  onClick={() => onResetPassword(rowData.idUser)} // Llama a la función para restablecer la contraseña
                />
              </div>
            )}
          />
        </DataTable>
      </div>
      {/* Modal que aparece para confirmar acciones críticas */}
      <Modal
        show={isModalVisible} // Controla la visibilidad del modal basado en el estado
        onClose={() => setIsModalVisible(false)} // Función para cerrar el modal
        onConfirm={handleConfirmToggleStatus} // Función para confirmar la acción
        title="Confirmar Acción" // Título del modal
        message={`
    ¿Estás seguro de que deseas ${currentEmployee?.status === "ACTIVE" ? "bloquear" : "activar"
          } al empleado ${currentEmployee?.firstName} ${currentEmployee?.lastName}?
  `} // Mensaje dinámico según la acción y el empleado seleccionado
      />
    </section>
  );
};

export default EmployeeList;