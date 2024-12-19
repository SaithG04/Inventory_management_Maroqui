import React, { useState, useMemo } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // O puedes usar react-icons si prefieres
import { toast } from "react-toastify";
import { Dropdown } from "primereact/dropdown";
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import Modal from "../../../../../infrastructure/shared/modal/Modal";
import EmployeeService from "../../../domain/services/EmployeeService";
import "./EmployeeForm.css";
import "react-toastify/dist/ReactToastify.css";

const EmployeeForm = ({ employeeData: initialData = null, onEmployeeSaved }) => {
    const [employeeData, setEmployeeData] = useState(
        initialData
            ? {
                ...initialData,
                role: initialData.roles?.[0] || "ADMINISTRATOR", // Extraer el primer rol
                maritalStatus: initialData.maritalStatus || "SOLTERO", // Asegurar estado civil
            }
            : {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                dni: "",
                age: "",
                birthDate: "",
                address: "",
                phone: "",
                sex: "MASCULINO",
                maritalStatus: "SOLTERO",
                role: "ADMINISTRATOR",
                status: "ACTIVE",
            }
    );

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalAction, setModalAction] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const employeeService = useMemo(() => new EmployeeService(), []);
    const nameValidationRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Solo permite letras y espacios, incluyendo tildes
    const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@miroqui\.es$/.test(email);
    const validateDni = (dni) => /^\d{8}$/.test(dni);
    const validatePhone = (phone) => {
        // Validar celular: 9 dígitos que comienzan con 9
        const celularPattern = /^9\d{8}$/;
        // Validar fijo: Prefijo '+' seguido de 2 dígitos y 7 números
        const fijoPattern = /^\+(\d{2})\d{7}$/;
        return celularPattern.test(phone) || fijoPattern.test(phone);
    };
    const validateAge = (age) => /^\d+$/.test(age); // Solo números

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validar campos obligatorios
        if (!employeeData.firstName || !employeeData.lastName || !employeeData.email || !employeeData.dni || !employeeData.address || !employeeData.phone) {
            toast.warn("Por favor, complete todos los campos obligatorios.");
            setLoading(false);
            return;
        }

        // Validar email
        if (!validateEmail(employeeData.email)) {
            toast.warn("El correo electrónico debe ser de la forma 'correo@miroqui.es'.");
            setLoading(false);
            return;
        }

        // Validar DNI
        if (!validateDni(employeeData.dni)) {
            toast.warn("El DNI debe tener exactamente 8 dígitos.");
            setLoading(false);
            return;
        }

        // Validar teléfono
        if (!validatePhone(employeeData.phone)) {
            toast.warn("El teléfono debe ser un celular de 9 dígitos comenzando con 9 o un número fijo con el prefijo '+XX'.");
            setLoading(false);
            return;
        }

        // Validar edad
        if (!validateAge(employeeData.age)) {
            toast.warn("La edad debe ser un número.");
            setLoading(false);
            return;
        }

        try {
            const payload = { ...employeeData };
            let employeeId;

            if (initialData) {
                // Actualizar empleado
                delete payload.password; // No enviar contraseña en actualización
                await employeeService.updateEmployee(employeeData.idUser, payload);
                employeeId = employeeData.idUser;
                toast.success("Empleado actualizado exitosamente.");
            } else {
                // Crear empleado
                const response = await employeeService.createEmployee(payload);
                employeeId = response.idUser; // Ajusta esto según la respuesta de tu API
                toast.success("Empleado creado exitosamente.");
            }

            // Asignar rol al empleado
            await employeeService.assignRole(employeeId, employeeData.role);
            toast.success("Rol asignado exitosamente.");

            onEmployeeSaved(); // Recargar la tabla
        } catch (err) {
            console.error("Error al guardar el empleado:", err);
            toast.error("Error al guardar el empleado. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };


    const handleCancel = () => {
        setModalMessage("¿Estás seguro de que deseas cancelar los cambios?");
        setModalAction(() => onEmployeeSaved);
        setShowModal(true);
    };

    console.log("Rendered Employee Data:", employeeData);

    return (
        <div className="employee-form">
            <h1>{initialData ? "Editar Empleado" : "Agregar Empleado"}</h1>
            <form onSubmit={handleSubmit}>
                <div className="p-field">
                    <InputText
                        placeholder="Nombre *"
                        value={employeeData.firstName}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (nameValidationRegex.test(value) || value === '') {
                                setEmployeeData({ ...employeeData, firstName: value });
                            }
                        }}
                    />
                </div>
                <div className="p-field">
                    <InputText
                        placeholder="Apellido *"
                        value={employeeData.lastName}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (nameValidationRegex.test(value) || value === '') {
                                setEmployeeData({ ...employeeData, lastName: value });
                            }
                        }}
                    />
                </div>
                <div className="p-field">
                    <InputText
                        placeholder="Correo Electrónico *"
                        value={employeeData.email}
                        onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
                    />
                </div>
                {!initialData && (
                    <div className="p-field">
                        <div className="p-inputgroup">
                            <InputText
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Contraseña *"
                                value={employeeData.password}
                                onChange={(e) => setEmployeeData({ ...employeeData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="p-inputgroup-addon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                )}
                <div className="p-field">
                    <InputText
                        placeholder="DNI *"
                        value={employeeData.dni}
                        onChange={(e) => {
                            // Validación para asegurar que solo se ingresen números y que tenga 9 dígitos
                            const value = e.target.value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
                            if (value.length <= 8) {
                                setEmployeeData({ ...employeeData, dni: value });
                            }
                        }}
                    />
                </div>
                <div className="p-field">
                    <InputNumber
                        placeholder="Edad *"
                        value={employeeData.age}
                        onValueChange={(e) => {
                            const value = e.value;
                            if (value !== null && value >= 1 && value <= 99) {
                                setEmployeeData({ ...employeeData, age: value });
                            }
                        }}
                        min={1}  // Mínimo 1
                        max={99} // Máximo 99 (2 dígitos)
                        maxLength={2}  // Limita la entrada a 2 dígitos
                    />
                </div>
                <div className="p-field">
                    <InputText
                        type="date"
                        placeholder="Fecha de Nacimiento *"
                        value={employeeData.birthDate}
                        onChange={(e) => setEmployeeData({ ...employeeData, birthDate: e.target.value })}
                    />
                </div>
                <div className="p-field">
                    <InputText
                        placeholder="Dirección *"
                        value={employeeData.address}
                        onChange={(e) => setEmployeeData({ ...employeeData, address: e.target.value })}
                    />
                </div>
                <div className="p-field">
                    <InputText
                        placeholder="Teléfono *"
                        value={employeeData.phone}
                        onChange={(e) => {
                            let phone = e.target.value;

                            // Validación para número fijo (+XX y hasta 7 dígitos)
                            const isValidFixed = phone.match(/^\+\d{0,2} ?\d{0,7}$/); // Prefijo +XX y hasta 7 dígitos
                            // Validación para número móvil (comienza con 9 y hasta 9 dígitos)
                            const isValidMobile = phone.match(/^9\d{0,8}$/); // Celular con 9 al inicio y hasta 9 dígitos

                            // Permitir actualizar el valor si es válido o si el campo está vacío
                            if (phone.length === 0 || isValidFixed || isValidMobile) {
                                setEmployeeData({ ...employeeData, phone: phone });
                            }
                        }}
                    />
                </div>

                <div className="p-field">
                    <Dropdown
                        value={employeeData.sex}
                        options={[
                            { label: "Masculino", value: "MASCULINO" },
                            { label: "Femenino", value: "FEMENINO" },
                        ]}
                        onChange={(e) => setEmployeeData({ ...employeeData, sex: e.value })}
                        placeholder="Seleccione Sexo"
                    />
                </div>
                <div className="p-field">
                    <Dropdown
                        value={employeeData.maritalStatus}
                        options={[
                            { label: "Soltero", value: "SOLTERO" },
                            { label: "Casado", value: "CASADO" },
                            { label: "Divorciado", value: "DIVORCIADO" },
                            { label: "Viudo", value: "VIUDO" },
                        ]}
                        onChange={(e) => setEmployeeData({ ...employeeData, maritalStatus: e.value })}
                        placeholder="Seleccione Estado Civil"
                    />
                </div>
                <div className="p-field">
                    <Dropdown value={employeeData.role} options={[{ label: "Administrador", value: "ADMINISTRATOR" }, { label: "Almacenero", value: "WAREHOUSE CLERK" }]} onChange={(e) => setEmployeeData({ ...employeeData, role: e.value })} placeholder="Seleccione Rol" />
                </div>
                <div className="p-field">
                    <Dropdown value={employeeData.status} options={[{ label: "Activo", value: "ACTIVE" }, { label: "Inactivo", value: "INACTIVE" }]} onChange={(e) => setEmployeeData({ ...employeeData, status: e.value })} placeholder="Seleccione Estado" />
                </div>
            </form>
            <div className="form-buttons">
                <button type="button" className="p-button p-button-success" disabled={loading} onClick={handleSubmit}>
                    {loading ? "Guardando..." : "Guardar"}
                </button>
                <button type="button" className="p-button p-button-secondary" onClick={handleCancel}>
                    Cancelar
                </button>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)} onConfirm={modalAction} title="Confirmación" message={modalMessage} />
        </div>
    );
};

export default EmployeeForm;
