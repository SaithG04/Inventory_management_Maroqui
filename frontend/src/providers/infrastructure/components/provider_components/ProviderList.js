import React, { useState, useEffect, useCallback, useMemo } from "react";
import ProviderService from "../../../domain/services/ProviderService";
import { ProviderDTO } from "../../dto/ProviderDTO";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Modal from "../../../../components/shared/modal/Modal";
import "./ProviderList.css";

const ProviderList = ({ onEditProvider, refreshTrigger, providers }) => {
  const [allProviders, setAllProviders] = useState([]); // Estado local para la lista de proveedores
  const [showModal, setShowModal] = useState(false); // Control del modal
  const [modalConfig, setModalConfig] = useState({}); // Configuración del modal
  const providerService = useMemo(() => new ProviderService(), []); // Servicio para llamadas a la API

  // Función para obtener la lista de proveedores desde el servidor
  const fetchProviders = useCallback(async () => {
    try {
      const response = await providerService.getAllProviders();
      const fetchedProviders = response?.data?.content || [];
      const validProviders = fetchedProviders
        .map((providerData) => {
          try {
            return new ProviderDTO(providerData).toDomain();
          } catch {
            return null; // Ignora proveedores con datos inválidos
          }
        })
        .filter((provider) => provider !== null); // Filtra valores nulos
      setAllProviders(validProviders); // Actualiza el estado local
    } catch (error) {
      console.error("Error fetching providers:", error);
      setAllProviders([]); // Manejo en caso de error
    }
  }, [providerService]);

  // Cargar la lista de proveedores cuando el componente se monta o cambia `refreshTrigger`
  useEffect(() => {
    fetchProviders();
  }, [fetchProviders, refreshTrigger]);

  // Función para eliminar un proveedor
  const onDeleteProvider = async (providerId) => {
    try {
      await providerService.deleteProvider(providerId);
      setAllProviders((prev) => prev.filter((provider) => provider.id !== providerId)); // Elimina localmente
    } catch (error) {
      console.error("Error deleting provider:", error);
    }
  };

  // Función para abrir el modal de confirmación
  const openModal = (action, providerId) => {
    const isEdit = action === "edit";
    setModalConfig({
      title: isEdit ? "Editar Proveedor" : "Eliminar Proveedor",
      message: isEdit
        ? "¿Estás seguro de que deseas editar este proveedor?"
        : "¿Estás seguro de que deseas eliminar este proveedor?",
      onConfirm: isEdit
        ? () => {
            onEditProvider(providerId); // Llama al callback para editar
            setShowModal(false);
          }
        : async () => {
            await onDeleteProvider(providerId); // Llama a la función para eliminar
            setShowModal(false);
          },
    });
    setShowModal(true); // Muestra el modal
  };

  // Decide si usa la lista desde el prop o desde el estado local
  const displayProviders = providers.length > 0 ? providers : allProviders;

  return (
    <div className="provider-list">
      {/* Tabla de proveedores */}
      <DataTable value={displayProviders} paginator rows={10} responsiveLayout="scroll">
        <Column field="name" header="Name" sortable />
        <Column field="contact" header="Contact" sortable />
        <Column field="phone" header="Phone" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="address" header="Address" />
        <Column field="conditions" header="Conditions" sortable />
        <Column field="state" header="Status" />
        <Column
          body={(rowData) => (
            <div className="providers-button-container">
              <Button
                icon="pi pi-pencil"
                label="Editar"
                className="providers-button-edit"
                onClick={() => openModal("edit", rowData.id)} // Abre modal para editar
              />
              <Button
                icon="pi pi-trash"
                label="Eliminar"
                className="providers-button-delete"
                onClick={() => openModal("delete", rowData.id)} // Abre modal para eliminar
              />
            </div>
          )}
          header="Actions"
        />
      </DataTable>

      {/* Modal de confirmación */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)} // Cierra el modal
        onConfirm={modalConfig.onConfirm} // Acción confirmada (editar o eliminar)
        title={modalConfig.title} // Título del modal
        message={modalConfig.message} // Mensaje del modal
      />
    </div>
  );
};

export default ProviderList;
