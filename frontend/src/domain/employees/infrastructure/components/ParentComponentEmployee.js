import React, { useState, useEffect, useCallback, useMemo } from "react";
import EmployeeForm from "./employee_components/EmployeeForm";
import EmployeeList from "./employee_components/EmployeeList";
import EmployeeSearch from "./employee_components/EmployeeSearch";
import EmployeeService from "../../domain/services/EmployeeService";
import Modal from "../../../../infrastructure/shared/modal/Modal"; // Importamos el Modal
import './ParentComponentEmployee.css';

const ParentComponentEmployee = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]); // Estado de empleados
  const [isFormVisible, setIsFormVisible] = useState(false); // Controla la visibilidad del formulario
  const [isModalVisible, setIsModalVisible] = useState(false); // Control del modal de confirmación
  const [employeeToDelete, setEmployeeToDelete] = useState(null); // Almacena el empleado a eliminar
  const [page, setPage] = useState(0); // Paginación
  const [rowsPerPage, setRowsPerPage] = useState(10); // Cantidad de filas por página

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
    console.log("Empleado a eliminar:", employeeId);  // Verificar el ID
    setEmployeeToDelete(employeeId);
    setIsModalVisible(true);
  };

  // Función para obtener los empleados de la API
  const fetchAllEmployees = useCallback(async (page, size) => {
    try {
      const response = await employeeService.getAllEmployees(page, size);
      console.log("Empleados recibidos:", response); // Verifica toda la respuesta

      // Asegurarse de que la respuesta tiene la propiedad "data" y que esta contiene empleados
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setAllEmployees(response.data.data); // Extraemos solo los empleados
      } else {
        setAllEmployees([]); // Si no hay empleados o hay un error, seteamos un array vacío
      }
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      setAllEmployees([]); // En caso de error, se vacía la lista
    }
  }, [employeeService]);

  useEffect(() => {
    fetchAllEmployees(page, rowsPerPage); // Obtener empleados al cargar el componente
  }, [fetchAllEmployees, page, rowsPerPage]);

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
      fetchAllEmployees(page, rowsPerPage); // Actualiza la lista de empleados después de la eliminación
    } catch (error) {
      console.error("Error al eliminar el empleado:", error);
    }
  };

  const handlePageChange = (newPage, size) => {
    setPage(newPage); // Actualiza la página actual
    setRowsPerPage(size); // Actualiza el número de filas por página
  };

  // Función para cancelar la eliminación
  const handleCancelDelete = () => {
    setIsModalVisible(false);
    setEmployeeToDelete(null); // Limpiamos el empleado seleccionado para eliminar
  };

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
              fetchAllEmployees(page, rowsPerPage); // Actualiza la lista de empleados
            }}
          />
        </div>
      )}

      {/* Lista de empleados */}
      <div className="employees-list">
        {/* Aseguramos que el componente solo se renderice cuando tengamos datos válidos */}
        {allEmployees.length > 0 ? (
          <EmployeeList
            employees={allEmployees} // Aseguramos que solo se pase el array de empleados
            onEditEmployee={handleEditEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            onPageChange={handlePageChange} // Paginación
          />
        ) : (
          <p>No employees found.</p> // Mensaje en caso de que no haya empleados
        )}
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
