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
        setLoading(true);

        // Validación de campos requeridos
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

        // Validación específica para el número de teléfono
        if (!/^\d{9}$/.test(providerData.phone)) {
            toast.current.show({
                severity: "warn",
                summary: "Validation Error",
                detail: "Phone number must be exactly 9 digits.",
                life: 3000,
            });
            setLoading(false);
            return;
        }

        const providerDTO = new ProviderDTO(providerData);

        try {
            if (isEditMode) {
                const updatedProvider = await providerService.updateProvider(providerId, providerDTO.toDomain());
                if (updatedProvider && updatedProvider.data) {
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Provider updated successfully!",
                        life: 3000,
                    });
                    onProviderSaved(updatedProvider.data);
                } else {
                    throw new Error("Update failed. No data returned.");
                }
            } else {
                const newProvider = await providerService.createProvider(providerDTO.toDomain());
                if (newProvider && newProvider.data) {
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Provider created successfully!",
                        life: 3000,
                    });
                    onProviderSaved(newProvider.data);
                } else {
                    throw new Error("Creation failed. No data returned.");
                }
            }
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
        setShowCancelModal(true); // Mostrar el modal para confirmar cancelación
    };

    const handleConfirmCancel = () => {
        setShowCancelModal(false); // Cerrar el modal
        onCancel(); // Llamar la función de cancelación
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
                                onChange={(e) =>
                                    setProviderData({ ...providerData, name: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-row">
                            <InputText
                                placeholder="Contact Person *"
                                value={providerData.contact}
                                onChange={(e) =>
                                    setProviderData({ ...providerData, contact: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-row">
                            <InputText
                                placeholder="Phone *"
                                value={providerData.phone}
                                onChange={(e) =>
                                    setProviderData({ ...providerData, phone: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-row">
                            <InputText
                                placeholder="Email *"
                                value={providerData.email}
                                onChange={(e) =>
                                    setProviderData({ ...providerData, email: e.target.value })
                                }
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
                                value={providerData.conditions}
                                onChange={(e) =>
                                    setProviderData({ ...providerData, conditions: e.target.value })
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
                <div className="form-buttons">
                    <Button
                        label={loading ? "Saving..." : "Save"}
                        icon="pi pi-check"
                        type="submit"
                        className="p-button-success"
                        disabled={loading}
                    />
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        className="p-button-secondary"
                        onClick={handleCancel} // Mostrar el modal
                    />
                </div>
            </form>

            {/* Modal de confirmación */}
            <Modal
                show={showCancelModal} // Propiedad show para controlar visibilidad
                onClose={() => setShowCancelModal(false)} // Cerrar el modal
                onConfirm={handleConfirmCancel} // Confirmar cancelación
                title="Confirm Cancel"
                message="Are you sure you want to cancel the operation?"
            />
        </div>
    );
};

export default ProviderForm;
