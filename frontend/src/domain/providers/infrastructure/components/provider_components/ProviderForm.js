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

        // No hacer nada si estamos en el proceso de cancelación
        if (isCanceling || showCancelModal) {
            return; // Salir de la función si estamos cancelando
        }
        if (!providerData.conditions || providerData.conditions.trim() === '') {
            providerData.conditions = 'Sin condiciones';
        }

        // Continuar con el envío si no estamos cancelando
        if (!providerData.name || !providerData.contact || !providerData.phone || !providerData.email) {
            toast.current.show({
                severity: "warn",
                summary: "Validation Error",
                detail: "Please fill in all required fields (Name, Contact, Phone, Email).",
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
                detail: "Please enter a valid email address.",
                life: 3000,
            });
            setLoading(false);
            return;
        }

        // Limpiar el número de teléfono eliminando caracteres no numéricos
        const cleanedPhone = providerData.phone.replace(/\D/g, "");
        if (!/^\d{9}$/.test(cleanedPhone)) {
            toast.current.show({
                severity: "warn",
                summary: "Validation Error",
                detail: "Phone number must be exactly 9 digits.",
                life: 3000,
            });
            setLoading(false);
            return;
        }

        setProviderData({ ...providerData, phone: cleanedPhone });

        const providerDTO = new ProviderDTO(providerData);

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

            // Pasar el proveedor guardado al padre para manejar las notificaciones
            onProviderSaved(savedProvider.data); // Aquí solo pasas el objeto del proveedor guardado (sin el toast)
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: `An error occurred while saving the provider: ${err.message}`,
                life: 3000,
            });
        } finally {
            setLoading(false);
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
            <h1>{isEditMode ? "Edit Provider" : "Add Provider"}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-columns">
                    <div className="form-column">
                        <div className="form-row">
                            <InputText
                                placeholder="Provider Name *"
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
                                placeholder="Contact Person *"
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
                                placeholder="Phone *"
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
                                placeholder="Email *"
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
                                placeholder="Address"
                                value={providerData.address}
                                onChange={(e) =>
                                    setProviderData({ ...providerData, address: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-row">
                            <InputText
                                placeholder="Conditions (optional)"
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
                <div className="form-buttons"> {/* Cambié provider-form-buttons por form-buttons */}
                    <Button
                        type="submit"
                        label={isEditMode ? "Update Provider" : "Save Provider"}
                        icon="pi pi-save"
                        className="p-button-success"
                        loading={loading}
                        onClick={handleSubmit}
                    />
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        className="p-button-secondary"
                        onClick={handleCancel}
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
