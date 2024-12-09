// src/components/EmployeeManagement/components/employee-table/EmployeeList.js
import React, { useEffect, useState, useRef } from "react";
import EmployeeService from "../../../domain/services/EmployeeService";
import { EmployeeDTO } from "../../dto/EmployeeDTO";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import './EmployeeList.css';

const EmployeeList = ({ onEditEmployee, onDeleteEmployee, employees }) => {
  const [allEmployees, setAllEmployees] = useState([]);
  const employeeService = new EmployeeService();
  const toast = useRef(null);

  useEffect(() => {
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

      setAllEmployees(validEmployees);
    } else {
      setAllEmployees([]);
    }
  }, [employees]);

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await employeeService.deleteEmployee(employeeId);
      toast.current.show({
        severity: "success",
        summary: "Deleted",
        detail: `Employee with ID: ${employeeId} deleted successfully!`,
        life: 3000,
      });
      onDeleteEmployee && onDeleteEmployee();
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

  const handleToggleStatus = async (employeeId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await employeeService.updateEmployeeStatus(employeeId, newStatus);
      toast.current.show({
        severity: "success",
        summary: "Status Updated",
        detail: `Employee status updated to ${newStatus}.`,
        life: 3000,
      });
      // Actualizar lista de empleados
      const updatedEmployees = allEmployees.map((emp) =>
        emp.id === employeeId ? { ...emp, status: newStatus } : emp
      );
      setAllEmployees(updatedEmployees);
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
          value={allEmployees}
          paginator
          rows={10}
          responsiveLayout="scroll"
          emptyMessage="No employees found."
        >
          <Column field="firstName" header="First Name" sortable />
          <Column field="lastName" header="Last Name" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="age" header="Age" sortable />
          <Column field="birthDate" header="Birth Date" sortable />
          <Column field="address" header="Address" />
          <Column field="phone" header="Phone" sortable />
          <Column field="sex" header="Sex" sortable />
          <Column field="maritalStatus" header="Marital Status" sortable />
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
