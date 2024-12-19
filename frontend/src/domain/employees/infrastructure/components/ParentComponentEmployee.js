// ParentComponentEmployee.js

// Importamos las dependencias necesarias para el componente
import React, { useState, useEffect, useCallback, useMemo } from "react";
import EmployeeForm from "./employee_components/EmployeeForm"; // Componente para agregar o editar empleados
import EmployeeList from "./employee_components/EmployeeList"; // Componente para listar empleados
import EmployeeSearch from "./employee_components/EmployeeSearch"; // Componente de búsqueda de empleados
import ResetPasswordForm from "./employee_components/ResetPasswordForm"; // Componente para restablecer contraseña
import EmployeeService from "../../domain/services/EmployeeService"; // Servicio para interactuar con la API de empleados
import Modal from "../../../../infrastructure/shared/modal/Modal"; // Componente para mostrar un modal de confirmación
import "./ParentComponentEmployee.css"; // Estilos para el componente

const ParentComponentEmployee = () => {
  // Declaramos los estados necesarios para el componente
  const [allEmployees, setAllEmployees] = useState([]); // Estado para almacenar todos los empleados
  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null); // Estado para almacenar los datos del empleado seleccionado
  const [isFormVisible, setIsFormVisible] = useState(false); // Estado para controlar si el formulario de empleado está visible
  const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false); // Estado para controlar si el formulario de restablecimiento de contraseña está visible
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar si el modal de confirmación de eliminación está visible
  const [employeeToDelete, setEmployeeToDelete] = useState(null); // Estado para almacenar el ID del empleado a eliminar

  // Memoización del servicio de empleados para evitar la creación de nuevas instancias en cada renderizado
  const employeeService = useMemo(() => new EmployeeService(), []);

  // Función para obtener todos los empleados desde el servicio de empleados
  const fetchAllEmployees = useCallback(async () => {
    try {
      const response = await employeeService.getAllEmployees(); // Llamada al servicio para obtener empleados
      console.log("Empleados recibidos:", response); // Mostrar los empleados en consola
      setAllEmployees(response); // Actualizar el estado con los empleados obtenidos
    } catch (error) {
      console.error("Error al obtener empleados:", error); // Manejo de errores
      setAllEmployees([]); // Si hay un error, reiniciar la lista de empleados a un array vacío
    }
  }, [employeeService]);

  // Llamar a la función para obtener todos los empleados cuando el componente se monte
  useEffect(() => {
    fetchAllEmployees(); // Obtiene la lista de empleados al montar el componente
  }, [fetchAllEmployees]);

  // Función para manejar la edición de un empleado
  const handleEditEmployee = (employee) => {
    setSelectedEmployeeData(employee); // Establecer los datos del empleado seleccionado
    setIsFormVisible(true); // Mostrar el formulario para editar el empleado
  };

  // Función para manejar el restablecimiento de la contraseña de un empleado
  const handleResetPassword = (employeeId) => {
    const employee = allEmployees.find(emp => emp.idUser === employeeId); // Buscar al empleado por su ID
    if (employee) {
      setSelectedEmployeeData(employee); // Establecer los datos del empleado seleccionado
      setIsPasswordFormVisible(true); // Mostrar el formulario para restablecer la contraseña
    }
  };

  // Función para alternar el estado de un empleado (activo/inactivo)
  const handleToggleStatus = async (employeeId, newStatus) => {
    try {
      await employeeService.updateEmployeeStatus(employeeId, newStatus); // Llamada al servicio para actualizar el estado del empleado
      fetchAllEmployees(); // Recargar la lista de empleados
    } catch (error) {
      console.error("Error al actualizar el estado del empleado:", error); // Manejo de errores
    }
  };

  // Función para confirmar la eliminación de un empleado
  const confirmDeleteEmployee = async () => {
    try {
      await employeeService.deleteEmployee(employeeToDelete); // Llamada al servicio para eliminar el empleado
      setIsModalVisible(false); // Cerrar el modal
      setEmployeeToDelete(null); // Limpiar el empleado a eliminar
      fetchAllEmployees(); // Recargar la lista de empleados después de eliminar
    } catch (error) {
      console.error("Error al eliminar empleado:", error); // Manejo de errores
    }
  };

  // Función actualizada para manejar los resultados de búsqueda, filtrando solo por correo electrónico
  const handleSearchResults = (searchResults) => {
    console.log("Resultados de búsqueda:", searchResults); // Mostrar los resultados de la búsqueda en consola
    setAllEmployees(searchResults); // Actualizar el estado solo con los resultados de la búsqueda
  };

  // Función para limpiar la búsqueda y mostrar todos los empleados nuevamente
  const handleClearSearch = () => {
    fetchAllEmployees(); // Llamar a la función para obtener todos los empleados nuevamente
  };

  return (
    <div className="employees-container">
      <h2>Gestión de Empleados</h2>

      {/* Barra de búsqueda (siempre visible) */}
      <EmployeeSearch
        employees={allEmployees} // Pasar todos los empleados al componente de búsqueda
        onSearchResults={handleSearchResults} // Función que se ejecuta con los resultados de la búsqueda
        onClear={handleClearSearch} // Función que se ejecuta para limpiar la búsqueda
      />

      {/* Mostrar botón de agregar empleado si el formulario NO está visible */}
      {!isFormVisible && (
        <button
          className="p-button add-employee-button"
          onClick={() => {
            setSelectedEmployeeData(null); // Restablecer los datos seleccionados al agregar un nuevo empleado
            setIsFormVisible(true); // Mostrar el formulario de agregar empleado
          }}
        >
          <i className="pi pi-plus" /> Agregar Empleado
        </button>
      )}

      {/* Mostrar formulario de Crear/Editar */}
      {isFormVisible && (
        <EmployeeForm
          employeeData={selectedEmployeeData} // Pasar los datos del empleado seleccionado al formulario
          onEmployeeSaved={() => {
            setIsFormVisible(false); // Ocultar el formulario después de guardar
            fetchAllEmployees(); // Recargar la lista de empleados
          }}
        />
      )}

      {/* Mostrar formulario de Resetear contraseña */}
      {isPasswordFormVisible && (
        <ResetPasswordForm
          employeeId={selectedEmployeeData.idUser}  // Pasar el ID del empleado seleccionado
          onPasswordReset={() => setIsPasswordFormVisible(false)} // Ocultar el formulario después de restablecer la contraseña
        />
      )}

      {/* Mostrar tabla de empleados solo si no se está mostrando el formulario de restablecimiento de contraseña */}
      {!isFormVisible && !isPasswordFormVisible && (
        <EmployeeList
          employees={allEmployees} // Pasar todos los empleados al componente de lista
          onEditEmployee={handleEditEmployee} // Función que se ejecuta al editar un empleado
          onResetPassword={handleResetPassword} // Función que se ejecuta al restablecer la contraseña
          onToggleStatus={handleToggleStatus} // Función que se ejecuta al alternar el estado del empleado
        />
      )}

      {/* Modal para confirmación de eliminación */}
      <Modal
        show={isModalVisible} // Controlar la visibilidad del modal
        onClose={() => setIsModalVisible(false)} // Cerrar el modal
        onConfirm={confirmDeleteEmployee} // Función que se ejecuta cuando se confirma la eliminación
        title="Confirmar Eliminación" // Título del modal
        message="¿Estás seguro de que deseas eliminar este empleado?" // Mensaje del modal
      />
    </div>
  );
};

export default ParentComponentEmployee;
