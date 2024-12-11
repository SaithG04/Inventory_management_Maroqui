import React, { useCallback, useState, useEffect, useMemo, useRef } from "react";
import { Toast } from "primereact/toast";
import ProviderForm from "./provider_components/ProviderForm";
import ProviderList from "./provider_components/ProviderList";
import ProviderSearch from "./provider_components/ProviderSearch";
import ProviderService from "../../domain/services/ProviderService";
import Modal from "../../../../infrastructure/shared/modal/Modal";
import "./ParentComponentProvider.css";

const ParentComponentProvider = () => {
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [allProviders, setAllProviders] = useState([]); // Lista de proveedores
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState(null);
  const toast = useRef(null); // Referencia para las notificaciones

  const providerService = useMemo(() => new ProviderService(), []); // Memoización del servicio

  // Función para obtener todos los proveedores de la API
  const fetchAllProviders = useCallback(async () => {
    try {
      const response = await providerService.getAllProviders();
      const fetchedProviders = response?.data?.content || [];
      setAllProviders(fetchedProviders); // Actualiza la lista de proveedores
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al obtener los proveedores.",
        life: 3000,
      });
    }
  }, [providerService]); // Solo se vuelve a crear si cambia providerService

  // Llamada a fetchAllProviders al cargar el componente
  useEffect(() => {
    fetchAllProviders();
  }, [fetchAllProviders]);

  // Función que maneja el guardado de proveedores
  const handleProviderSaved = (savedProvider) => {
    setAllProviders((prevProviders) => {
      const providerExists = prevProviders.some((provider) => provider.id === savedProvider.id);

      // Verificamos si estamos creando o actualizando un proveedor
      if (savedProvider.id) {
        // Si tiene un id, significa que es una actualización
        if (providerExists) {
          return prevProviders.map((provider) =>
            provider.id === savedProvider.id ? savedProvider : provider
          );
        } else {
          return [...prevProviders, savedProvider]; // Si el id no está en la lista, lo agregamos como nuevo
        }
      } else {
        // Si no tiene id, estamos creando un nuevo proveedor (sin id)
        return [...prevProviders, savedProvider];
      }
    });

    toast.current.show({
      severity: "success",
      summary: savedProvider.id ? "Proveedor actualizado" : "Proveedor creado", // Mostrar mensaje adecuado
      detail: `Proveedor ${savedProvider.id ? "actualizado" : "creado"} correctamente.`,
      life: 3000,
    });
    setIsFormVisible(false); // Cerrar formulario después de guardar
  };

  // Función para limpiar la búsqueda
  const handleClearSearch = () => {
    fetchAllProviders(); // Restaurar la lista completa de proveedores
  };

  // Función para manejar los resultados de la búsqueda
  const handleSearchResults = (results) => {
    if (results.length === 0) {
      toast.current.show({
        severity: "info",
        summary: "Sin resultados",
        detail: "No se encontraron proveedores.",
        life: 3000,
      });
    }
    setAllProviders(results); // Actualiza la lista de proveedores con los resultados
  };

  return (
    <div className="providers-container">
      <Toast ref={toast} />
      <h2>Gestión de Proveedores</h2>

      <ProviderSearch
        onSearchResults={handleSearchResults} // Función para actualizar la lista de proveedores con la búsqueda
        onClearSearch={handleClearSearch} // Función para restaurar la lista completa
      />

      {!isFormVisible && (
        <>
          <div className="button-container">
            <button
              className="p-button add-provider-button"
              onClick={() => {
                setSelectedProviderId(null); // Aseguramos que sea un nuevo proveedor
                setIsFormVisible(true); // Mostrar formulario de creación
              }}
            >
              <i className="pi pi-plus" /> Agregar Proveedor
            </button>
          </div>
          <ProviderList
            providers={allProviders} // Lista de proveedores actualizada
            onEditProvider={(id) => {
              setSelectedProviderId(id); // Seleccionar proveedor para editar
              setIsFormVisible(true);
            }}
            onDeleteProvider={(id) => {
              setProviderToDelete(id); // Marcar proveedor a eliminar
              setIsModalVisible(true);
            }}
          />
        </>
      )}

      {isFormVisible && (
        <ProviderForm
          providerId={selectedProviderId}
          onProviderSaved={handleProviderSaved}
          onCancel={() => setIsFormVisible(false)} // Función para cancelar
          toast={toast}
        />
      )}

      <Modal
        show={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={async () => {
          try {
            await providerService.deleteProvider(providerToDelete); // Eliminar proveedor
            setAllProviders((prev) =>
              prev.filter((provider) => provider.id !== providerToDelete) // Filtrar el proveedor eliminado
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
          }
        }}
        title="Confirmar Eliminación"
        message="¿Está seguro de que desea eliminar este proveedor?"
      />
    </div>
  );
};

export default ParentComponentProvider;
