import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { EmployeeDTO } from "../../dto/EmployeeDTO";
import './EmployeeList.css';

const EmployeeList = ({ employees, onEditEmployee, onDeleteEmployee, onPageChange, onToggleStatus }) => {
  const [allEmployees, setAllEmployees] = useState([]); // Sólo usamos 'allEmployees'
  const toast = useRef(null);

  // Efecto para manejar el listado de empleados
  useEffect(() => {
    console.log("employees prop received:", employees); // Verificamos si estamos recibiendo los empleados correctamente

    if (employees && employees.length > 0) {
      const validEmployees = employees
        .map((employeeData) => {
          try {
            const employeeDTO = new EmployeeDTO(employeeData);
            return employeeDTO.toDomain();
          } catch (err) {
            console.error("Error converting employee to domain:", employeeData, err);
            return null;
          }
        })
        .filter((employee) => employee !== null);

      console.log("Valid employees:", validEmployees); // Verificamos la lista filtrada de empleados

      setAllEmployees(validEmployees); // Actualiza la lista de empleados
    } else {
      console.log("No employees found or employees array is empty.");
      setAllEmployees([]); // Si no hay empleados, setea una lista vacía
    }
  }, [employees]);

  // Función para eliminar un empleado
  const handleDeleteEmployee = async (employeeId) => {
    console.log("Deleting employee with ID:", employeeId); // Verificamos el ID que estamos tratando de eliminar
    try {
      await onDeleteEmployee(employeeId); // Llamamos a la función de eliminación pasada como prop
      toast.current.show({
        severity: "success",
        summary: "Deleted",
        detail: `Employee with ID: ${employeeId} deleted successfully!`,
        life: 3000,
      });
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to delete employee with ID: ${employeeId}.`,
        life: 3000,
      });
    }
  };

  // Función para cambiar el estado de un empleado (activo/inactivo)
  const handleToggleStatus = async (employeeId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    console.log(`Toggling status for employee ${employeeId}, current status: ${currentStatus}, new status: ${newStatus}`); // Verificamos el cambio de estado
    try {
      await onToggleStatus(employeeId, newStatus); // Llamamos a la función de actualización de estado pasada como prop
      toast.current.show({
        severity: "success",
        summary: "Status Updated",
        detail: `Employee status updated to ${newStatus}.`,
        life: 3000,
      });
    } catch (error) {
      console.error("Error updating employee status:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update employee status.",
        life: 3000,
      });
    }
  };

  // Confirmación de eliminación
  const confirmDelete = (employeeId) => {
    confirmDialog({
      message: "Are you sure you want to delete this employee?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => handleDeleteEmployee(employeeId),
    });
  };

  return (
    <section className="employee-list-section">
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="employee-list">
        <DataTable
          value={allEmployees} // Usamos 'allEmployees' para mostrar los datos
          paginator
          rows={10}
          totalRecords={employees.length} // Asegúrate de que el número total de registros se pase como prop
          onPage={(e) => onPageChange(e.page, e.rows)} // Llamamos la función 'onPageChange' recibida como prop
          responsiveLayout="scroll"
          emptyMessage="No employees found."
        >
          <Column field="firstName" header="First Name" sortable />
          <Column field="lastName" header="Last Name" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="dni" header="DNI" sortable />
          <Column field="age" header="Age" sortable />
          <Column
            field="birthDate"
            header="Birth Date"
            sortable
            body={(rowData) => new Date(rowData.birthDate).toLocaleDateString()}
          />
          <Column field="address" header="Address" />
          <Column field="phone" header="Phone" sortable />
          <Column field="sex" header="Sex" sortable />
          <Column field="maritalStatus" header="Marital Status" sortable />
          <Column field="roleName" header="Role" sortable />
          <Column
            field="status"
            header="Status"
            sortable
            body={(rowData) => (
              <span className={`status-pill ${rowData.status.toLowerCase()}`}>
                {rowData.status === "ACTIVE" ? "Activo" : "Inactivo"}
              </span>
            )}
          />
          <Column
            body={(rowData) => (
              <div className="employee-button-container">
                <Button
                  icon="pi pi-pencil"
                  label="Editar"
                  className="p-button employee-button-edit"
                  onClick={() => onEditEmployee(rowData.id)}
                />
                <Button
                  icon="pi pi-user-edit"
                  label={rowData.status === "ACTIVE" ? "Desactivar" : "Activar"}
                  className="p-button employee-button-toggle-status"
                  onClick={() => handleToggleStatus(rowData.id, rowData.status)}
                />
                <Button
                  icon="pi pi-refresh"
                  label="Restablecer"
                  className="p-button employee-button-reset-password"
                  onClick={() => console.log("Reset password")}
                />
                <Button
                  icon="pi pi-trash"
                  label="Eliminar"
                  className="p-button p-button-danger"
                  onClick={() => confirmDelete(rowData.id)}
                />
              </div>
            )}
            header="Actions"
          />
        </DataTable>
      </div>
    </section>
  );
};

export default EmployeeList;
