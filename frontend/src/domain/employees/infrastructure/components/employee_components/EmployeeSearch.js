// src/domain/employees/infrastructure/components/employee_components/EmployeeSearch.js

// Importación de dependencias necesarias
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Button } from 'primereact/button'; // Componente de botón de PrimeReact
import { InputText } from 'primereact/inputtext'; // Componente de entrada de texto de PrimeReact
import { Toast } from 'primereact/toast'; // Componente de notificaciones de PrimeReact
import EmployeeService from '../../../domain/services/EmployeeService'; // Servicio para manejar datos de empleados
import { EmployeeDTO } from '../../dto/EmployeeDTO'; // DTO para transformar datos de empleados
import './EmployeeSearch.css'; // Archivo de estilos CSS específico para este componente

/**
 * Componente para buscar empleados por email.
 * @param {Array} employees - Lista de empleados inicial.
 * @param {Function} onSearchResults - Callback para manejar los resultados de la búsqueda.
 * @param {Function} onClear - Callback para manejar la limpieza de la búsqueda.
 */
const EmployeeSearch = ({ employees, onSearchResults, onClear }) => {
  // Estado para el email ingresado en el campo de búsqueda
  const [email, setEmail] = useState('');
  // Estado para controlar el estado de carga durante la búsqueda
  const [loading, setLoading] = useState(false);
  // Referencia para mostrar mensajes con Toast
  const toast = useRef(null);
  // Memoización de la instancia del servicio de empleados para evitar recrearla en cada render
  const employeeService = useMemo(() => new EmployeeService(), []);

  /**
   * Efecto que verifica si el Toast está montado correctamente.
   */
  useEffect(() => {
    if (!toast.current) {
      console.error("Toast no está montado correctamente.");
    }
  }, []);

  /**
   * Función para buscar empleados por email.
   * Utiliza el servicio `EmployeeService` para realizar la búsqueda y maneja los resultados.
   */
  const searchEmail = useCallback(async () => {
    let query = email.trim(); // Elimina espacios en blanco al inicio y al final del email
    if (!query) {
      // Si el email está vacío, limpia los resultados y termina
      onSearchResults([]);
      return;
    }

    setLoading(true); // Activa el estado de carga
    try {
      // Llama al servicio para buscar empleados por email
      const response = await employeeService.findByEmail(query);

      console.log("Respuesta de la búsqueda:", response);

      if (response.length > 0) {
        // Si se encuentran resultados, transforma los datos usando el DTO
        const employeeDTO = new EmployeeDTO(response[0]);
        const employee = employeeDTO.toDomain(); // Convierte el DTO a su representación de dominio
        onSearchResults([employee]); // Pasa el resultado al callback
      } else {
        console.warn('No se encontraron empleados con ese email');
        onSearchResults([]); // Pasa un array vacío si no hay resultados
      }
    } catch (err) {
      console.error('Error al buscar empleados:', err);
      // Muestra un mensaje de error utilizando Toast si está disponible
      if (toast.current) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al buscar empleados.',
          life: 3000,
        });
      }
      onSearchResults([]); // Limpia los resultados en caso de error
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  }, [email, employeeService, onSearchResults]);

  /**
   * Función para limpiar el campo de búsqueda y restablecer los resultados.
   */
  const handleClearSearch = () => {
    setEmail(''); // Limpia el campo de email
    onSearchResults(employees); // Restaura la lista inicial de empleados
    onClear(); // Llama al callback para manejar la limpieza
  };

  return (
    <div className="employee-search-section">
      {/* Componente de notificación */}
      <Toast ref={toast} />
      <div className="employee-search-input">
        {/* Campo de entrada de texto para buscar por email */}
        <InputText
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Actualiza el estado del email
          placeholder="Ingrese el email del empleado" // Texto de marcador
        />
      </div>

      <div className="search-clear-buttons">
        {/* Botón para realizar la búsqueda */}
        <Button
          label={loading ? 'Cargando...' : 'Buscar'} // Cambia el texto según el estado de carga
          onClick={searchEmail} // Llama a la función de búsqueda
          disabled={loading || !email.trim()} // Deshabilitado si está cargando o el email está vacío
          className="search-button"
        />
        {/* Botón para limpiar la búsqueda */}
        <Button
          label="Limpiar"
          onClick={handleClearSearch} // Llama a la función de limpieza
          disabled={loading} // Deshabilitado si está cargando
          className="clear-button"
        />
      </div>
    </div>
  );
};

export default EmployeeSearch; // Exporta el componente para su uso en otras partes del proyecto
