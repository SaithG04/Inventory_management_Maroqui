import React, { useState, useEffect, useCallback, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import Modal from "../../../../../infrastructure/shared/modal/Modal";
import ProviderService from "../../../domain/services/ProviderService";
import { ProviderDTO } from "../../dto/ProviderDTO";
import "./ProviderForm.css";

const ProviderForm = ({ providerId, onProviderSaved, onCancel, toast }) => {
    const [providerData, setProviderData] = useState({
        name: "",
        contact: "",
        phone: "",
        email: "",
        address: "",
        state: "ACTIVE",
        conditions: "",
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false); // Agregar estado para manejar el cancelado
    const [showCancelModal, setShowCancelModal] = useState(false);

    const providerService = useMemo(() => new ProviderService(), []);

    const fetchProvider = useCallback(async () => {
        if (!providerId) return;
        setLoading(true);
        try {
            const response = await providerService.getProviderById(providerId);
            if (response && response.data) {
                setProviderData(response.data);
            } else {
                toast.current.show({
                    severity: "warn",
                    summary: "Warning",
                    detail: "No provider found for editing.",
                    life: 3000,
                });
            }
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to fetch provider details.",
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    }, [providerId, providerService, toast]);

    useEffect(() => {
        if (providerId) {
            setIsEditMode(true);
            fetchProvider();
        } else {
            setIsEditMode(false);
            setProviderData({
                name: "",
                contact: "",
                phone: "",
                email: "",
                address: "",
                state: "ACTIVE",
                conditions: "",
            });
        }
    }, [providerId, fetchProvider]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading || isCanceling || showCancelModal) return; // Evitar múltiples envíos

        setLoading(true); // Bloquear el botón inmediatamente

        const fieldMessages = {
            name: "Nombre",
            contact: "Contacto",
            email: "Correo",
        };

        const missingFields = Object.keys(fieldMessages).filter(
            (field) => !providerData[field] || providerData[field].trim() === ""
        );

        if (missingFields.length > 0) {
            const missingFieldNames = missingFields.map((field) => fieldMessages[field]).join(", ");
            toast.current.show({
                severity: "warn",
                summary: "Validation Error",
                detail: `Por favor, rellene los siguientes campos: ${missingFieldNames}.`,
                life: 3000,
            });
            setLoading(false);
            return;
        }

        // Validación de correo electrónico
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(providerData.email)) {
            toast.current.show({
                severity: "warn",
                summary: "Validation Error",
                detail: "Por favor, introduce una dirección de correo electrónico válida.",
                life: 3000,
            });
            setLoading(false);
            return;
        }

        // Validación de número de teléfono
        const cleanedPhone = providerData.phone.replace(/\s+/g, ""); // Eliminar espacios

        // Móviles: 9 dígitos que comienzan con 9
        const isMobile = /^9\d{8}$/.test(cleanedPhone);

        // Fijos: Comienzan con + seguido de dos dígitos y de 6 a 7 dígitos
        const isLandline = /^\+\d{2}\d{6,7}$/.test(cleanedPhone);

        if (!isMobile && !isLandline) {
            toast.current.show({
                severity: "warn",
                summary: "Validation Error",
                detail: "El número debe ser un móvil (9 dígitos, ejemplo: 912345678) o fijo (+XX seguido del número, ejemplo: +011234567).",
                life: 3000,
            });
            setLoading(false);
            return;
        }



        // Limpieza y ajustes de datos
        const updatedProviderData = {
            ...providerData,
            phone: cleanedPhone,
            conditions: providerData.conditions.trim() || "Sin condiciones", // Asegurar "Sin condiciones"
        };

        const providerDTO = new ProviderDTO(updatedProviderData);

        try {
            let savedProvider;

            if (isEditMode) {
                savedProvider = await providerService.updateProvider(providerId, providerDTO.toDomain());
                if (!savedProvider || !savedProvider.data) {
                    throw new Error("Update failed. No data returned.");
                }
            } else {
                savedProvider = await providerService.createProvider(providerDTO.toDomain());
                if (!savedProvider || !savedProvider.data) {
                    throw new Error("Creation failed. No data returned.");
                }
            }

            onProviderSaved(savedProvider.data); // Notifica al componente padre
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: `An error occurred while saving the provider: ${err.message}`,
                life: 3000,
            });
        } finally {
            setLoading(false); // Permitir nuevamente clics después de completar la operación
        }
    };



    const handleCancel = () => {
        // Verificar si los campos obligatorios están vacíos
        const { name, contact, email, phone } = providerData;

        // Si los campos obligatorios están vacíos, cancelamos directamente sin mostrar el modal
        if (!name && !contact && !email && !phone) {
            onCancel(); // Cierra el formulario sin mostrar el modal
            return;
        }

        // Si hay datos en los campos obligatorios, mostramos el modal de confirmación
        setShowCancelModal(true);
    };

    const handleConfirmCancel = () => {
        setIsCanceling(true); // Marcamos que estamos en el proceso de cancelación
        setShowCancelModal(false); // Cerrar el modal de confirmación
        setProviderData({
            name: "",
            contact: "",
            phone: "",
            email: "",
            address: "",
            state: "ACTIVE",
            conditions: "",
        }); // Limpiar los campos del formulario
        onCancel(); // Ejecuta la lógica de cancelación (ocultar formulario)
    };

    return (
        <div className="add-provider-form">
            <h1>{isEditMode ? "Editar Proveedor" : "Agregar Proveedor"}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-columns">
                    <div className="form-column">
                        <div className="form-row">
                            <InputText
                                placeholder="Nombre Proveedor *"
                                value={providerData.name}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Validamos que solo contenga letras (y espacios)
                                    if (/^[A-Za-z\s]*$/.test(value)) {
                                        setProviderData({ ...providerData, name: value });
                                    }
                                }}
                            />
                        </div>

                        <div className="form-row">
                            <InputText
                                placeholder="Contacto *"
                                value={providerData.contact}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Validamos que solo contenga letras y espacios
                                    if (/^[A-Za-z\s]*$/.test(value)) {
                                        setProviderData({ ...providerData, contact: value });
                                    }
                                }}
                            />
                        </div>

                        <div className="form-row">
                            <InputText
                                placeholder="Teléfono *"
                                value={providerData.phone}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Permitir solo números, el signo '+' al principio y los espacios
                                    if (/^[\d\s+]*$/.test(value)) { // Solo números, espacios y '+'
                                        setProviderData({ ...providerData, phone: value });
                                    }
                                }}
                            />
                        </div>

                        <div className="form-row">
                            <InputText
                                type="email"
                                placeholder="Correo *"
                                value={providerData.email}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Validar que el email tenga al menos un '@'
                                    if (value.includes('@')) {
                                        setProviderData({ ...providerData, email: value });
                                    } else {
                                        // Si no tiene '@', puedes dejar el campo vacío o manejarlo de alguna forma
                                        setProviderData({ ...providerData, email: value });
                                    }
                                }}
                            />
                        </div>


                    </div>
                    <div className="form-column">
                        <div className="form-row">
                            <InputText
                                placeholder="Dirección"
                                value={providerData.address}
                                onChange={(e) =>
                                    setProviderData({ ...providerData, address: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-row">
                            <InputText
                                placeholder="Condición (opcional)"
                                value={providerData.conditions}  // Mostrar directamente lo que contiene 'conditions'
                                onChange={(e) =>
                                    setProviderData({
                                        ...providerData,
                                        conditions: e.target.value,  // Actualizar el valor ingresado directamente
                                    })
                                }
                            />
                        </div>
                        <div className="form-row">
                            <Dropdown
                                value={providerData.state}
                                options={[
                                    { label: "Active", value: "ACTIVE" },
                                    { label: "Inactive", value: "INACTIVE" },
                                ]}
                                onChange={(e) =>
                                    setProviderData({ ...providerData, state: e.value })
                                }
                                placeholder="Select Status"
                            />
                        </div>
                    </div>
                </div>
                {/* Botón de Guardar */}
                <div className="form-buttons">
                    <Button
                        type="submit"
                        label={isEditMode ? "Update Provider" : "Save Provider"}
                        icon="pi pi-save"
                        className="p-button-success"
                        loading={loading} // Indicador de carga visual
                        disabled={loading} // Deshabilitar el botón cuando está cargando
                        onClick={handleSubmit}
                    />
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        className="p-button-secondary"
                        onClick={handleCancel}
                        disabled={loading} // También deshabilitar el botón cancelar si está cargando
                    />
                </div>

            </form >

            {/* Modal de confirmación */}
            < Modal
                show={showCancelModal} // Propiedad show para controlar visibilidad
                onClose={() => setShowCancelModal(false)} // Cerrar el modal
                onConfirm={handleConfirmCancel} // Confirmar cancelación
                title="Confirm Cancel"
                message="Are you sure you want to cancel the operation?"
            />
        </div >
    );
};

export default ProviderForm;
