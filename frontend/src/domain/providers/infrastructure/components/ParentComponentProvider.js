import React, { useCallback, useState, useEffect, useMemo, useRef } from "react";
import { Toast } from "primereact/toast";
import ProviderForm from "./provider_components/ProviderForm";  // Importación del formulario de proveedor
import ProviderList from "./provider_components/ProviderList";  // Importación de la lista de proveedores
import ProviderSearch from "./provider_components/ProviderSearch";  // Importación del componente de búsqueda
import ProviderService from "../../domain/services/ProviderService";  // Importación del servicio de proveedores
import Modal from "../../../../infrastructure/shared/modal/Modal";  // Importación de modal
import "./ParentComponentProvider.css";  // Estilos del componente

// Componente principal de gestión de proveedores
const ParentComponentProvider = () => {
  // Estados para manejar la lógica y visualización de proveedores
  const [selectedProviderId, setSelectedProviderId] = useState(null);  // ID del proveedor seleccionado para edición
  const [allProviders, setAllProviders] = useState([]);  // Lista de proveedores
  const [isDeleting, setIsDeleting] = useState(false);  // Estado de carga para la eliminación
  const [isFormVisible, setIsFormVisible] = useState(false);  // Controla la visibilidad del formulario
  const [isModalVisible, setIsModalVisible] = useState(false);  // Controla la visibilidad del modal de confirmación
  const [providerToDelete, setProviderToDelete] = useState(null);  // Proveedor seleccionado para eliminar
  const toast = useRef(null);  // Referencia para el Toast (notificaciones)

  // Memoización de la instancia de ProviderService para optimizar la re-renderización
  const providerService = useMemo(() => new ProviderService(), []); 

  // Función para obtener todos los proveedores
  const fetchAllProviders = useCallback(async () => {
    try {
      const response = await providerService.getAllProviders();  // Llamada al servicio para obtener proveedores
      const fetchedProviders = response?.data?.content || [];  // Extrae los proveedores desde la respuesta
      setAllProviders(fetchedProviders);  // Actualiza la lista de proveedores
    } catch (error) {
      // Manejo de errores en caso de fallo en la API
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al obtener los proveedores.",
        life: 3000,
      });
    }
  }, [providerService]);  // Se vuelve a ejecutar si cambia providerService

  // Llamada al cargar el componente
  useEffect(() => {
    fetchAllProviders();  // Obtiene todos los proveedores cuando se carga el componente
  }, [fetchAllProviders]);

  // Función que maneja el guardado de un proveedor
  const handleProviderSaved = (savedProvider) => {
    setAllProviders((prevProviders) => {
      const providerExists = prevProviders.some((provider) => provider.id === savedProvider.id);

      // Verificamos si el proveedor ya existe, si existe lo actualizamos, si no lo agregamos
      if (providerExists) {
        return prevProviders.map((provider) =>
          provider.id === savedProvider.id ? savedProvider : provider
        );
      } else {
        return [...prevProviders, savedProvider];
      }
    });

    // Notificación de éxito
    toast.current.show({
      severity: "success",
      summary: savedProvider.id ? "Proveedor actualizado" : "Proveedor creado", // Mensaje de éxito según si es actualización o creación
      detail: `Proveedor ${savedProvider.id ? "actualizado" : "creado"} correctamente.`,
      life: 3000,
    });
    setIsFormVisible(false);  // Cerrar formulario después de guardar
  };

  // Función para limpiar la búsqueda y restaurar la lista completa
  const handleClearSearch = () => {
    fetchAllProviders();  // Restaurar lista completa de proveedores
  };

  // Función para manejar los resultados de la búsqueda
  const handleSearchResults = (results) => {
    if (results.length === 0) {
      // Si no hay resultados, mostrar una notificación
      toast.current.show({
        severity: "info",
        summary: "Sin resultados",
        detail: "No se encontraron proveedores.",
        life: 3000,
      });
    }
    setAllProviders(results);  // Actualizar lista de proveedores con los resultados de la búsqueda
  };

  return (
    <div className="providers-container">
      <Toast ref={toast} />  {/* Componente para mostrar notificaciones */}
      <h2>Gestión de Proveedores</h2>

      {/* Componente de búsqueda de proveedores */}
      <ProviderSearch
        onSearchResults={handleSearchResults}  // Pasar los resultados de la búsqueda
        onClearSearch={handleClearSearch}  // Función para limpiar la búsqueda
      />

      {!isFormVisible && (
        <>
          <div className="button-container">
            <button
              className="p-button add-provider-button"
              onClick={() => {
                setSelectedProviderId(null);  // Asegurar que sea un proveedor nuevo
                setIsFormVisible(true);  // Mostrar formulario de creación
              }}
            >
              <i className="pi pi-plus" /> Agregar Proveedor
            </button>
          </div>
          {/* Lista de proveedores con botones de editar y eliminar */}
          <ProviderList
            providers={allProviders}  // Lista de proveedores actualizada
            onEditProvider={(id) => {
              setSelectedProviderId(id);  // Seleccionar proveedor para editar
              setIsFormVisible(true);  // Mostrar formulario de edición
            }}
            onDeleteProvider={(id) => {
              setProviderToDelete(id);  // Marcar proveedor para eliminar
              setIsModalVisible(true);  // Mostrar modal de confirmación de eliminación
            }}
          />
        </>
      )}

      {/* Formulario de proveedor */}
      {isFormVisible && (
        <ProviderForm
          providerId={selectedProviderId}  // Proveedor seleccionado para editar o agregar
          onProviderSaved={handleProviderSaved}  // Función para manejar el guardado
          onCancel={() => setIsFormVisible(false)}  // Función para cancelar y cerrar el formulario
          toast={toast}
        />
      )}

      {/* Modal de confirmación para eliminación */}
      <Modal
        show={isModalVisible}
        onClose={() => setIsModalVisible(false)}  // Cerrar modal
        onConfirm={async () => {
          try {
            await providerService.deleteProvider(providerToDelete);  // Eliminar proveedor
            setAllProviders((prev) =>
              prev.filter((provider) => provider.id !== providerToDelete)  // Filtrar el proveedor eliminado
            );
            setIsModalVisible(false);
            toast.current.show({
              severity: "success",
              summary: "Eliminado",
              detail: "Proveedor eliminado correctamente.",
              life: 3000,
            });
          } catch (error) {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Error al eliminar el proveedor.",
              life: 3000,
            });
          } finally {
            setIsDeleting(false);  // Desactivar el estado de carga
          }
        }}
        title="Confirmar Eliminación"
        message="¿Está seguro de que desea eliminar este proveedor?"  // Mensaje de confirmación
        isLoading={isDeleting}  // Pasar estado de carga al modal
      />
    </div>
  );
};

export default ParentComponentProvider;  // Exportar el componente para usarlo en otros archivos
