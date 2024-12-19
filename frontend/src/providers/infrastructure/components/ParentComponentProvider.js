import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Toast } from "primereact/toast"; // Importa Toast
import ProviderForm from "./provider_components/ProviderForm";
import ProviderList from "./provider_components/ProviderList";
import ProviderSearch from "./provider_components/ProviderSearch";
import ProviderService from "../../domain/services/ProviderService";
import Modal from "../../../components/shared/modal/Modal";
import "./ParentComponentProvider.css";

const ParentComponentProvider = () => {
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [allProviders, setAllProviders] = useState([]); // Lista completa de proveedores
  const [isFormVisible, setIsFormVisible] = useState(false); // Visibilidad del formulario
  const [isModalVisible, setIsModalVisible] = useState(false); // Visibilidad del modal
  const [providerToDelete, setProviderToDelete] = useState(null); // Proveedor a eliminar
  const toast = useRef(null); // Referencia para las notificaciones

  const providerService = useMemo(() => new ProviderService(), []);

  const fetchAllProviders = useCallback(async () => {
    try {
      const response = await providerService.getAllProviders();
      setAllProviders(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error("Error al obtener los proveedores:", error);
      setAllProviders([]);
    }
  }, [providerService]);

  const handleProviderSaved = async (savedProvider) => {
    setIsFormVisible(false); // Oculta el formulario
    setAllProviders((prevProviders) => {
      const providerExists = prevProviders.some(
        (provider) => provider.id === savedProvider.id
      );

      if (providerExists) {
        // Actualizar proveedor existente
        return prevProviders.map((provider) =>
          provider.id === savedProvider.id ? savedProvider : provider
        );
      } else {
        // Agregar nuevo proveedor
        return [...prevProviders, savedProvider];
      }
    });

    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: `Provider ${
        savedProvider.id ? "updated" : "created"
      } successfully!`,
      life: 3000,
    });
  };

  useEffect(() => {
    fetchAllProviders();
  }, [fetchAllProviders]);

  return (
    <div className="providers-container">
      <Toast ref={toast} /> {/* Contenedor de notificaciones */}
      <h2>Provider Management</h2>

      <ProviderSearch
        providers={allProviders}
        onSearchResults={(results) => setAllProviders(results)}
      />

      <div className="button-container">
        <button
          className="p-button add-provider-button"
          onClick={() => setIsFormVisible(true)}
        >
          <i className="pi pi-plus" /> Add Provider
        </button>
      </div>

      {isFormVisible && (
        <ProviderForm
          providerId={selectedProviderId}
          onProviderSaved={handleProviderSaved}
          onCancel={() => setIsFormVisible(false)}
          toast={toast} // Pasa la referencia de Toast
        />
      )}

      <ProviderList
        providers={allProviders}
        onEditProvider={(id) => {
          setSelectedProviderId(id);
          setIsFormVisible(true);
        }}
        onDeleteProvider={(id) => {
          setProviderToDelete(id);
          setIsModalVisible(true);
        }}
      />

      <Modal
        show={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={async () => {
          try {
            await providerService.deleteProvider(providerToDelete);
            setAllProviders((prev) =>
              prev.filter((provider) => provider.id !== providerToDelete)
            );
            setIsModalVisible(false);
            toast.current.show({
              severity: "success",
              summary: "Deleted",
              detail: "Provider deleted successfully!",
              life: 3000,
            });
          } catch (error) {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to delete provider.",
              life: 3000,
            });
          }
        }}
        title="Confirm Deletion"
        message="Are you sure you want to delete this provider?"
      />
    </div>
  );
};

export default ParentComponentProvider;
