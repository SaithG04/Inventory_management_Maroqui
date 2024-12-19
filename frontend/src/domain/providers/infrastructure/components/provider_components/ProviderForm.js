// Importación de dependencias de React y componentes de la librería PrimeReact, 
// además de otros servicios y componentes que serán utilizados dentro del formulario.
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { InputText } from "primereact/inputtext";  // Componente de entrada de texto
import { Dropdown } from "primereact/dropdown";    // Componente de lista desplegable
import { Button } from "primereact/button";        // Componente de botón
import Modal from "../../../../../infrastructure/shared/modal/Modal"; // Modal reutilizable
import ProviderService from "../../../domain/services/ProviderService"; // Servicio para manejar la API de proveedores
import { ProviderDTO } from "../../dto/ProviderDTO"; // DTO para los datos del proveedor
import "./ProviderForm.css"; // Estilos personalizados para el formulario

// Definición del componente ProviderForm. Recibe props que incluyen providerId, onProviderSaved, onCancel y toast.
const ProviderForm = ({ providerId, onProviderSaved, onCancel, toast }) => {
    // Estado que almacena los datos del proveedor.
    const [providerData, setProviderData] = useState({
        name: "",
        contact: "",
        phone: "",
        email: "",
        address: "",
        state: "ACTIVE", // Estado por defecto
        conditions: "",
    });

    // Estado que determina si estamos en modo edición o no.
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false); // Estado para manejar el cargado de datos
    const [isCanceling, setIsCanceling] = useState(false); // Estado que maneja el proceso de cancelación
    const [showCancelModal, setShowCancelModal] = useState(false); // Estado para mostrar el modal de cancelación

    // Instancia de ProviderService para realizar peticiones relacionadas con los proveedores
    const providerService = useMemo(() => new ProviderService(), []);

    // Función para obtener los detalles del proveedor desde la API.
    const fetchProvider = useCallback(async () => {
        if (!providerId) return; // Si no existe un providerId, no se hace nada.
        setLoading(true); // Comienza el proceso de carga
        try {
            const response = await providerService.getProviderById(providerId); // Llamada al servicio para obtener el proveedor
            if (response && response.data) {
                setProviderData(response.data); // Si la respuesta es válida, actualiza el estado de providerData
            } else {
                toast.current.show({
                    severity: "warn", // Muestra una advertencia si no se encuentra el proveedor
                    summary: "Warning",
                    detail: "No provider found for editing.",
                    life: 3000,
                });
            }
        } catch (err) {
            toast.current.show({
                severity: "error", // Muestra un error si falla la llamada a la API
                summary: "Error",
                detail: "Failed to fetch provider details.",
                life: 3000,
            });
        } finally {
            setLoading(false); // Finaliza el proceso de carga independientemente del resultado
        }
    }, [providerId, providerService, toast]);

    // Hook useEffect que se ejecuta cuando cambia el providerId.
    useEffect(() => {
        if (providerId) {
            setIsEditMode(true); // Activa el modo de edición si existe providerId
            fetchProvider(); // Obtiene los datos del proveedor
        } else {
            setIsEditMode(false); // Si no hay providerId, desactiva el modo de edición
            setProviderData({
                name: "",
                contact: "",
                phone: "",
                email: "",
                address: "",
                state: "ACTIVE",
                conditions: "",
            }); // Resetea los datos del proveedor
        }
    }, [providerId, fetchProvider]);

    // Función que maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario

        // Evita que se envíe el formulario si está en proceso de carga, cancelación o en la pantalla de cancelación.
        if (loading || isCanceling || showCancelModal) return;

        setLoading(true); // Bloquea el botón de envío para evitar envíos múltiples

        // Mensajes para los campos del formulario
        const fieldMessages = {
            name: "Nombre",
            contact: "Contacto",
            email: "Correo",
        };

        // Validación para comprobar si faltan campos obligatorios
        const missingFields = Object.keys(fieldMessages).filter(
            (field) => !providerData[field] || providerData[field].trim() === ""
        );

        if (missingFields.length > 0) {
            const missingFieldNames = missingFields.map((field) => fieldMessages[field]).join(", ");
            toast.current.show({
                severity: "warn", // Muestra una advertencia si faltan campos
                summary: "Validation Error",
                detail: `Por favor, rellene los siguientes campos: ${missingFieldNames}.`,
                life: 3000,
            });
            setLoading(false); // Finaliza el proceso de carga
            return;
        }

        // Validación del correo electrónico utilizando una expresión regular
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(providerData.email)) {
            toast.current.show({
                severity: "warn", // Muestra una advertencia si el correo no es válido
                summary: "Validation Error",
                detail: "Por favor, introduce una dirección de correo electrónico válida.",
                life: 3000,
            });
            setLoading(false); // Finaliza el proceso de carga
            return;
        }

        // Validación del número de teléfono
        const cleanedPhone = providerData.phone.replace(/\s+/g, ""); // Elimina cualquier espacio en blanco del número de teléfono

        // Validación para móviles: El número debe tener 9 dígitos y empezar con 9
        const isMobile = /^9\d{8}$/.test(cleanedPhone);

        // Validación para teléfonos fijos: Debe comenzar con "+" seguido de dos dígitos y entre 6 a 7 dígitos adicionales
        const isLandline = /^\+\d{2}\d{6,7}$/.test(cleanedPhone);
        // Si el número de teléfono no es móvil ni fijo, muestra un mensaje de advertencia
        if (!isMobile && !isLandline) {
            toast.current.show({
                severity: "warn", // Muestra advertencia
                summary: "Validation Error",
                detail: "El número debe ser un móvil (9 dígitos, ejemplo: 912345678) o fijo (+XX seguido del número, ejemplo: +011234567).",
                life: 3000, // Duración del mensaje
            });
            setLoading(false); // Finaliza la carga para que se pueda hacer otra acción
            return; // Detiene la ejecución si la validación falla
        }

        // Limpieza y ajustes de datos
        const updatedProviderData = {
            ...providerData, // Mantiene los datos existentes del proveedor
            phone: cleanedPhone, // Actualiza el número de teléfono limpio
            conditions: providerData.conditions.trim() || "Sin condiciones", // Si no hay condiciones, asigna "Sin condiciones"
        };

        // Crea una nueva instancia del DTO con los datos actualizados
        const providerDTO = new ProviderDTO(updatedProviderData);

        try {
            let savedProvider;

            // Si estamos en modo edición, actualizamos el proveedor existente
            if (isEditMode) {
                savedProvider = await providerService.updateProvider(providerId, providerDTO.toDomain());
                if (!savedProvider || !savedProvider.data) {
                    throw new Error("Update failed. No data returned.");
                }
            } else {
                // Si no estamos en modo edición, creamos un nuevo proveedor
                savedProvider = await providerService.createProvider(providerDTO.toDomain());
                if (!savedProvider || !savedProvider.data) {
                    throw new Error("Creation failed. No data returned.");
                }
            }

            onProviderSaved(savedProvider.data); // Llama a la función onProviderSaved para notificar al componente padre
        } catch (err) {
            // Si ocurre un error durante la operación, muestra un mensaje de error
            toast.current.show({
                severity: "error", // Muestra un mensaje de error
                summary: "Error",
                detail: `An error occurred while saving the provider: ${err.message}`,
                life: 3000,
            });
        } finally {
            setLoading(false); // Permite que el formulario sea interactivo de nuevo una vez que la operación esté completa
        };
    };

    // Función para manejar la cancelación del formulario
    const handleCancel = () => {
        // Verifica si los campos obligatorios están vacíos
        const { name, contact, email, phone } = providerData;

        // Si los campos obligatorios están vacíos, simplemente cancela y cierra el formulario sin mostrar el modal
        if (!name && !contact && !email && !phone) {
            onCancel(); // Ejecuta la lógica de cancelación (cierra el formulario)
            return;
        }

        // Si hay datos en los campos obligatorios, muestra el modal de confirmación
        setShowCancelModal(true);
    };

    // Función para confirmar la cancelación
    const handleConfirmCancel = () => {
        setIsCanceling(true); // Marca el proceso como de cancelación
        setShowCancelModal(false); // Cierra el modal de confirmación
        setProviderData({
            name: "",
            contact: "",
            phone: "",
            email: "",
            address: "",
            state: "ACTIVE", // Restaura el estado a 'ACTIVE'
            conditions: "",
        }); // Limpia los campos del formulario
        onCancel(); // Ejecuta la lógica de cancelación (oculta el formulario)
    };

    return (
        <div className="add-provider-form">
            {/* Título: Agregar o Editar Proveedor */}
            <h1>{isEditMode ? "Editar Proveedor" : "Agregar Proveedor"}</h1>
            
            {/* Formulario de Proveedor */}
            <form onSubmit={handleSubmit}>
                <div className="form-columns">
                    {/* Columna 1: Información básica del Proveedor */}
                    <div className="form-column">
    
                        {/* Fila: Nombre del Proveedor */}
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
    
                        {/* Fila: Contacto del Proveedor */}
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
    
                        {/* Fila: Teléfono del Proveedor */}
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
    
                        {/* Fila: Correo Electrónico del Proveedor */}
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
    
                    {/* Columna 2: Información adicional del Proveedor */}
                    <div className="form-column">
    
                        {/* Fila: Dirección del Proveedor */}
                        <div className="form-row">
                            <InputText
                                placeholder="Dirección"
                                value={providerData.address}
                                onChange={(e) =>
                                    setProviderData({ ...providerData, address: e.target.value })
                                }
                            />
                        </div>
    
                        {/* Fila: Condición del Proveedor (opcional) */}
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
    
                        {/* Fila: Estado del Proveedor */}
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
