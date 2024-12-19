import React, { useState, useEffect, useCallback, useMemo } from "react";
import EmployeeForm from "./employee_components/EmployeeForm";
import EmployeeList from "./employee_components/EmployeeList";
import EmployeeSearch from "./employee_components/EmployeeSearch";
import EmployeeService from "../../domain/services/EmployeeService";
import Modal from "../../../components/shared/modal/Modal"; // Importamos el Modal
import './ParentComponentEmployee.css';

const ParentComponentEmployee = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false); // Controla la visibilidad del formulario
  const [isModalVisible, setIsModalVisible] = useState(false); // Control del modal de confirmación
  const [employeeToDelete, setEmployeeToDelete] = useState(null); // Almacena el empleado a eliminar

  const employeeService = useMemo(() => new EmployeeService(), []);

  // Función para editar un empleado
  const handleEditEmployee = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setIsFormVisible(true); // Muestra el formulario para editar
  };

  // Función para agregar un nuevo empleado
  const handleAddEmployee = () => {
    setSelectedEmployeeId(null); // No hay un empleado seleccionado
    setIsFormVisible(true); // Muestra el formulario para agregar
  };

  // Función para eliminar un empleado
  const handleDeleteEmployee = (employeeId) => {
    setEmployeeToDelete(employeeId); // Guardamos el ID del empleado a eliminar
    setIsModalVisible(true); // Mostramos el modal de confirmación
  };

  // Función para obtener todos los empleados
  const fetchAllEmployees = useCallback(async () => {
    const response = await employeeService.getAllEmployees();
    setAllEmployees(response?.data || []);
  }, [employeeService]);

  // Función para manejar los resultados de búsqueda
  const handleSearchResults = (results) => {
    setAllEmployees(results);
  };

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    try {
      await employeeService.deleteEmployee(employeeToDelete);
      setIsModalVisible(false);
      setEmployeeToDelete(null);
      fetchAllEmployees(); // Actualiza la lista de empleados después de la eliminación
    } catch (error) {
      console.error("Error al eliminar el empleado:", error);
    }
  };

  // Función para cancelar la eliminación
  const handleCancelDelete = () => {
    setIsModalVisible(false);
    setEmployeeToDelete(null); // Limpiamos el empleado seleccionado para eliminar
  };

  useEffect(() => {
    fetchAllEmployees();
  }, [fetchAllEmployees]);

  return (
    <div className="employees-container">
      <h2>Employee Management</h2>

      {/* Componente de búsqueda */}
      <EmployeeSearch
        employees={allEmployees}
        onSearchResults={handleSearchResults}
      />

      <div className="button-container">
        <button
          className="p-button add-employee-button"
          onClick={handleAddEmployee}
        >
          <i className="pi pi-plus" /> Add Employee
        </button>
      </div>

      {/* Mostrar el formulario solo si 'isFormVisible' es true */}
      {isFormVisible && (
        <div className="add-employee-form">
          <EmployeeForm
            employeeId={selectedEmployeeId}
            onEmployeeSaved={() => { // Cuando se guarda o cancela el empleado
              setIsFormVisible(false); // Oculta el formulario
              fetchAllEmployees(); // Actualiza la lista de empleados
            }}
          />
        </div>
      )}

      {/* Lista de empleados */}
      <div className="employees-list">
        <EmployeeList
          employees={allEmployees}
          onEditEmployee={handleEditEmployee}
          onDeleteEmployee={handleDeleteEmployee}
        />
      </div>

      {/* Modal de confirmación de eliminación */}
      <Modal
        show={isModalVisible}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmación de Eliminación"
        message="¿Estás seguro de que deseas eliminar este empleado?"
      />
    </div>
  );
};

export default ParentComponentEmployee;
