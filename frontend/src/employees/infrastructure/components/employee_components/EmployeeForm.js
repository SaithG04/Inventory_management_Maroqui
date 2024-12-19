import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { Dropdown } from "primereact/dropdown"; // Importar Dropdown de PrimeReact
import EmployeeService from "../../../domain/services/EmployeeService";
import { EmployeeDTO } from "../../dto/EmployeeDTO";
import Modal from "../../../../components/shared/modal/Modal";
import "./EmployeeForm.css";
import "react-toastify/dist/ReactToastify.css";

const EmployeeForm = ({ employeeId, onEmployeeSaved }) => {
    const [employeeData, setEmployeeData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        age: "",
        birthDate: "",
        address: "",
        phone: "",
        sex: "",
        maritalStatus: "",
        status: "ACTIVE", // Agregado: Campo de estado con valor predeterminado
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalAction, setModalAction] = useState(null);

    const employeeService = useMemo(() => new EmployeeService(), []);

    // Validaciones
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone) => /^\d{9}$/.test(phone);

    // Obtener detalles del empleado en modo edición
    const fetchEmployee = useCallback(async () => {
        if (!employeeId) return;
        setLoading(true);
        try {
            const response = await employeeService.getEmployeeById(employeeId);
            setEmployeeData(response.data);
            toast.info("Datos del empleado cargados correctamente.");
        } catch (err) {
            toast.error("Error al obtener los detalles del empleado.");
        } finally {
            setLoading(false);
        }
    }, [employeeId, employeeService]);

    useEffect(() => {
        if (employeeId) {
            setIsEditMode(true);
            fetchEmployee();
        } else {
            setIsEditMode(false);
            setEmployeeData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                age: "",
                birthDate: "",
                address: "",
                phone: "",
                sex: "",
                maritalStatus: "",
                status: "ACTIVE", // Campo de estado inicializado
            });
        }
    }, [employeeId, fetchEmployee]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validaciones básicas
        if (!employeeData.firstName || !employeeData.lastName || !employeeData.email || !employeeData.phone) {
            toast.warn("Los campos Nombre, Apellido, Correo Electrónico y Teléfono son obligatorios.");
            setLoading(false);
            return;
        }

        if (!validateEmail(employeeData.email)) {
            toast.warn("El correo electrónico no es válido.");
            setLoading(false);
            return;
        }

        if (!validatePhone(employeeData.phone)) {
            toast.warn("El teléfono debe tener 9 dígitos.");
            setLoading(false);
            return;
        }

        const employeeDTO = new EmployeeDTO(employeeData);

        try {
            if (isEditMode) {
                await employeeService.updateEmployee(employeeId, employeeDTO.toDomain());
                toast.success("Empleado actualizado exitosamente.");
            } else {
                await employeeService.createEmployee(employeeDTO.toDomain());
                toast.success("Empleado creado exitosamente.");
            }
            onEmployeeSaved(); // Notificar al componente padre
        } catch (err) {
            toast.error("Error al guardar el empleado. Por favor, intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setModalMessage("¿Estás seguro de que deseas cancelar los cambios?");
        setModalAction(() => () => {
            onEmployeeSaved();
            toast.info("Cambios cancelados.");
            setEmployeeData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                age: "",
                birthDate: "",
                address: "",
                phone: "",
                sex: "",
                maritalStatus: "",
                status: "ACTIVE", // Restablecer el estado predeterminado
            });
        });
        setShowModal(true);
    };

    const handleSave = () => {
        setModalMessage("¿Estás seguro de que deseas guardar los cambios?");
        setModalAction(handleSubmit);
        setShowModal(true);
    };

    return (
        <div className="employee-form">
            <h1>{isEditMode ? "Editar Empleado" : "Agregar Empleado"}</h1>
            <form onSubmit={handleSubmit}>
                <div className="p-field">
                    <input
                        type="text"
                        placeholder="Nombre *"
                        value={employeeData.firstName}
                        onChange={(e) => setEmployeeData({ ...employeeData, firstName: e.target.value })}
                    />
                </div>
                <div className="p-field">
                    <input
                        type="text"
                        placeholder="Apellido *"
                        value={employeeData.lastName}
                        onChange={(e) => setEmployeeData({ ...employeeData, lastName: e.target.value })}
                    />
                </div>
                <div className="p-field">
                    <input
                        type="email"
                        placeholder="Correo Electrónico *"
                        value={employeeData.email}
                        onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
                    />
                </div>
                {!isEditMode && (
                    <div className="p-field">
                        <input
                            type="password"
                            placeholder="Contraseña *"
                            value={employeeData.password}
                            onChange={(e) => setEmployeeData({ ...employeeData, password: e.target.value })}
                        />
                    </div>
                )}
                <div className="p-field">
                    <input
                        type="number"
                        placeholder="Edad"
                        value={employeeData.age}
                        onChange={(e) => setEmployeeData({ ...employeeData, age: e.target.value })}
                    />
                </div>
                <div className="p-field">
                    <input
                        type="date"
                        placeholder="Fecha de Nacimiento"
                        value={employeeData.birthDate}
                        onChange={(e) => setEmployeeData({ ...employeeData, birthDate: e.target.value })}
                    />
                </div>
                <div className="p-field">
                    <input
                        type="text"
                        placeholder="Dirección"
                        value={employeeData.address}
                        onChange={(e) => setEmployeeData({ ...employeeData, address: e.target.value })}
                    />
                </div>
                <div className="p-field">
                    <input
                        type="text"
                        placeholder="Teléfono *"
                        value={employeeData.phone}
                        onChange={(e) => setEmployeeData({ ...employeeData, phone: e.target.value })}
                    />
                </div>
                <div className="p-field">
                    <select
                        value={employeeData.sex}
                        onChange={(e) => setEmployeeData({ ...employeeData, sex: e.target.value })}
                    >
                        <option value="" disabled>Seleccione Sexo</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>
                </div>
                <div className="p-field">
                    <select
                        value={employeeData.maritalStatus}
                        onChange={(e) => setEmployeeData({ ...employeeData, maritalStatus: e.target.value })}
                    >
                        <option value="" disabled>Estado Civil</option>
                        <option value="Soltero">Soltero</option>
                        <option value="Casado">Casado</option>
                        <option value="Divorciado">Divorciado</option>
                        <option value="Viudo">Viudo</option>
                    </select>
                </div>
                <div className="p-field">
                    <Dropdown
                        value={employeeData.status}
                        options={[
                            { label: "Activo", value: "ACTIVE" },
                            { label: "Inactivo", value: "INACTIVE" },
                        ]}
                        onChange={(e) => setEmployeeData({ ...employeeData, status: e.value })}
                        placeholder="Seleccione Estado"
                    />
                </div>
            </form>
            <div className="form-buttons">
                <button
                    type="button"
                    className="p-button p-button-success"
                    disabled={loading}
                    onClick={handleSave}
                >
                    {loading ? "Guardando..." : "Guardar"}
                </button>
                <button
                    type="button"
                    className="p-button p-button-secondary"
                    onClick={handleCancel}
                >
                    Cancelar
                </button>
            </div>
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={modalAction}
                title="Confirmación"
                message={modalMessage}
            />
        </div>
    );
};

export default EmployeeForm;
