import React, { useState, useRef, useMemo } from "react"; // Importación de hooks y funcionalidades de React
import { Button } from "primereact/button"; // Importación del componente Button de PrimeReact
import { InputText } from "primereact/inputtext"; // Importación del componente InputText de PrimeReact
import { Dropdown } from "primereact/dropdown"; // Importación del componente Dropdown de PrimeReact
import { Toast } from "primereact/toast"; // Importación del componente Toast de PrimeReact
import ProviderService from "../../../domain/services/ProviderService"; // Importación del servicio de proveedores
import "./ProviderSearch.css"; // Importación de los estilos personalizados

// Componente ProviderSearch
const ProviderSearch = ({ onSearchResults, onClearSearch }) => {
  // Definición de los estados locales para manejar el tipo de búsqueda, la consulta, el estado de los proveedores y el indicador de carga
  const [searchType, setSearchType] = useState(null); // Estado para el tipo de búsqueda (nombre o estado)
  const [query, setQuery] = useState(""); // Estado para el valor de búsqueda
  const [status, setStatus] = useState("ACTIVE"); // Estado para el filtro de estado (activo o inactivo)
  const [loading, setLoading] = useState(false); // Estado para controlar el indicador de carga
  const toast = useRef(null); // Referencia para mostrar mensajes de Toast

  // Memorizar la instancia del servicio de proveedores para evitar su recreación en cada renderizado
  const providerService = useMemo(() => new ProviderService(), []);

  // Función que maneja la búsqueda de proveedores
  const handleSearch = async () => {
    setLoading(true); // Establecer el estado de carga a true al iniciar la búsqueda

    try {
      let response = []; // Inicializar la variable para almacenar los resultados

      // Búsqueda por nombre
      if (searchType === "name" && query) {
        response = await providerService.findByName(query, 0, 15); // Llamada al servicio de búsqueda por nombre
      } 
      // Búsqueda por estado
      else if (searchType === "status" && status) {
        response = await providerService.findByStatus(status, 0, 15); // Llamada al servicio de búsqueda por estado
      }

      // Verificar si se encontraron resultados
      if (Array.isArray(response) && response.length > 0) {
        onSearchResults(response); // Pasar los resultados al componente padre
      } else {
        toast.current.show({ // Mostrar un mensaje Toast si no se encuentran proveedores
          severity: "warn", // Severidad de advertencia
          summary: "Sin resultados", // Título del mensaje
          detail: "No se encontraron proveedores.", // Detalle del mensaje
          life: 3000, // Duración del mensaje en milisegundos
        });
        onSearchResults([]); // Vaciar los resultados si no se encuentra nada
      }
    } catch (error) {
      toast.current.show({ // Mostrar un mensaje Toast si ocurre un error
        severity: "error", // Severidad de error
        summary: "Error", // Título del mensaje
        detail: "Ocurrió un error al obtener los resultados. Inténtelo nuevamente.", // Detalle del mensaje
        life: 3000, // Duración del mensaje
      });
      onSearchResults([]); // Vaciar los resultados en caso de error
    } finally {
      setLoading(false); // Finalizar la carga
    }
  };

  // Función para limpiar el formulario de búsqueda
  const handleClearSearch = () => {
    console.log("Clear button clicked"); // Mensaje de depuración cuando se hace clic en el botón limpiar
    console.log("onClearSearch:", onClearSearch); // Verificar el valor de `onClearSearch` en consola
    setQuery(""); // Restablecer la consulta
    setStatus("ACTIVE"); // Restablecer el estado a "ACTIVE"
    setSearchType(null); // Restablecer el tipo de búsqueda a nulo
    onClearSearch(); // Llamar a la función `onClearSearch` pasada como prop
  };

  return (
    <div className="provider-search-section"> {/* Contenedor principal del formulario de búsqueda */}
      <Toast ref={toast} /> {/* Componente Toast para mostrar mensajes */}

      <div className="provider-search-dropdown">
        {/* Dropdown para seleccionar el tipo de búsqueda (por nombre o por estado) */}
        <Dropdown
          value={searchType} // Valor actual del tipo de búsqueda
          options={[ // Opciones para el tipo de búsqueda
            { label: "Nombre", value: "name", dataTestId: "search-type-name" }, // Búsqueda por nombre
            { label: "Estado", value: "status", dataTestId: "search-type-status" }, // Búsqueda por estado
          ]}
          onChange={(e) => setSearchType(e.value)} // Actualizar el tipo de búsqueda cuando se selecciona una opción
          placeholder="Seleccione Tipo de Búsqueda" // Texto de marcador de posición
          data-testid="search-type-dropdown" // ID de prueba para los tests
          itemTemplate={(option) => (
            <span data-testid={option.dataTestId}>{option.label}</span> // Renderizar las opciones con el ID de prueba
          )}
        />
      </div>

      <div className="provider-input">
        {/* Mostrar el campo de selección de estado solo cuando el tipo de búsqueda es "status" */}
        {searchType === "status" && (
          <Dropdown
            value={status} // Valor actual del estado
            options={[ // Opciones para el estado (activo o inactivo)
              { label: "Activo", value: "ACTIVE" },
              { label: "Inactivo", value: "INACTIVE" },
            ]}
            onChange={(e) => setStatus(e.value)} // Actualizar el estado cuando se selecciona una opción
            placeholder="Select Status" // Texto de marcador de posición
            data-testid="status-dropdown" // ID de prueba para los tests
            optionLabel="label" // Etiqueta para mostrar en las opciones
            aria-label="Status Dropdown" // Atributo para accesibilidad
          />
        )}
        {/* Mostrar el campo de texto para nombre solo cuando el tipo de búsqueda no es "status" */}
        {(!searchType || searchType === "name") && (
          <InputText
            value={query} // Valor de la consulta
            onChange={(e) => setQuery(e.target.value)} // Actualizar la consulta cuando se escribe
            placeholder="Enter provider name" // Texto de marcador de posición
            aria-label="Search by Name" // Atributo para accesibilidad
            className="name-input" // Clase CSS para los estilos
            disabled={!searchType} // Deshabilitar el campo si no se selecciona un tipo de búsqueda
          />
        )}
      </div>

      <div className="search-clear-buttons">
        {/* Botón de búsqueda */}
        <Button
          label={loading ? "Cargando..." : "Buscar"} // Cambiar el texto según el estado de carga
          onClick={handleSearch} // Llamar a handleSearch al hacer clic
          disabled={loading || !searchType || (searchType === "name" && !query.trim())} // Deshabilitar si está cargando o no se ha seleccionado un tipo de búsqueda o consulta
          className="search-button" // Clase CSS para los estilos
        />
        {/* Botón de limpiar */}
        <Button
          label="Limpiar" // Etiqueta del botón
          onClick={handleClearSearch} // Llamar a handleClearSearch al hacer clic
          disabled={loading} // Deshabilitar si está cargando
          className="clear-button" // Clase CSS para los estilos
        />
      </div>
    </div>
  );
};

export default ProviderSearch;
