import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './Suppliers.css';
import 'primereact/resources/themes/saga-blue/theme.css'; // Tema de PrimeReact
import 'primereact/resources/primereact.min.css'; // Componentes de PrimeReact
import 'primeicons/primeicons.css'; // Iconos de PrimeReact

// Importación de los estilos personalizados
import './Suppliers.css'; // Tus estilos personalizados para el DataTable

const Suppliers = () => {
    const [proveedores, setProveedores] = useState([]);
    const [filteredProveedores, setFilteredProveedores] = useState([]);
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [conditions, setConditions] = useState('');
    const [categoryId, setCategoryId] = useState(null);
    const [status, setStatus] = useState('ACTIVE');
    const [editingIndex, setEditingIndex] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isInactive, setIsInactive] = useState(false);
    const [categories] = useState([
        { label: 'Categoría 1', value: 1 },
        { label: 'Categoría 2', value: 2 },
        { label: 'Categoría 3', value: 3 }
    ]);

    // Estados de error para la validación del formulario
    const [nameError, setNameError] = useState(false);
    const [contactError, setContactError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [categoryIdError, setCategoryIdError] = useState(false);
    const [statusError, setStatusError] = useState(false);

    useEffect(() => {
        const storedProveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
        setProveedores(storedProveedores);
        setFilteredProveedores(storedProveedores);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Reiniciar errores anteriores
        setNameError(false);
        setContactError(false);
        setPhoneError(false);
        setEmailError(false);
        setCategoryIdError(false);
        setStatusError(false);

        // Validación de campos
        let valid = true;

        if (!name) {
            setNameError(true);
            valid = false;
        }
        if (!contact) {
            setContactError(true);
            valid = false;
        }
        if (!phone) {
            setPhoneError(true);
            valid = false;
        }
        if (!email) {
            setEmailError(true);
            valid = false;
        }
        if (!categoryId) {
            setCategoryIdError(true);
            valid = false;
        }
        if (!status) {
            setStatusError(true);
            valid = false;
        }

        if (!valid) {
            // No continuar si los campos no son válidos
            return;
        }

        // Confirmación antes de guardar
        const confirmSave = window.confirm("¿Estás seguro de que deseas guardar el proveedor?");
        if (!confirmSave) {
            return;
        }

        const nuevoProveedor = { name, contact, phone, email, address, conditions, categoryId, status };

        let updatedProveedores;

        if (editingIndex !== null) {
            // Editar un proveedor existente
            updatedProveedores = proveedores.map((proveedor, i) =>
                i === editingIndex ? nuevoProveedor : proveedor
            );
            setEditingIndex(null);
        } else {
            // Agregar un nuevo proveedor
            updatedProveedores = [...proveedores, nuevoProveedor];
        }

        setProveedores(updatedProveedores);
        setFilteredProveedores(updatedProveedores);
        localStorage.setItem('proveedores', JSON.stringify(updatedProveedores));

        // Limpiar los campos del formulario
        setName('');
        setContact('');
        setPhone('');
        setEmail('');
        setAddress('');
        setConditions('');
        setCategoryId('');
        setStatus('ACTIVE');
        setIsFormVisible(false);
    };



    const handleEdit = (index) => {
        const proveedor = proveedores[index];
        setName(proveedor.name);
        setContact(proveedor.contact);
        setPhone(proveedor.phone);
        setEmail(proveedor.email);
        setAddress(proveedor.address);
        setConditions(proveedor.conditions);
        setCategoryId(proveedor.categoryId);
        setStatus(proveedor.status);
        setEditingIndex(index);
        setIsFormVisible(true);
    };

    const handleDelete = (index) => {
        const updatedProveedores = proveedores.filter((_, i) => i !== index);
        setProveedores(updatedProveedores);
        setFilteredProveedores(updatedProveedores);
        localStorage.setItem('proveedores', JSON.stringify(updatedProveedores));
    };

    // Función para alternar la visibilidad del formulario (agregar/cancelar)
    const handleToggleForm = () => {
        // Verificar si hay datos ingresados en el formulario
        if (isFormVisible && (name || contact || phone || email || address || conditions || categoryId)) {
            const confirmCancel = window.confirm("Hay datos ingresados. ¿Estás seguro de que deseas cancelar y perder los datos?");
            if (!confirmCancel) {
                return; // No cerrar si el usuario decide no cancelar
            }
        }

        // Alternar la visibilidad del formulario
        setIsFormVisible(!isFormVisible);

        // Si se está ocultando el formulario, limpiar los campos
        if (isFormVisible) {
            resetForm();
        }
    };

    // Función para limpiar los campos del formulario
    const resetForm = () => {
        setName('');
        setContact('');
        setPhone('');
        setEmail('');
        setAddress('');
        setConditions('');
        setCategoryId(''); // Reiniciar a un valor vacío
        setStatus(''); // Reiniciar a un valor vacío para mostrar el placeholder
    };

    const filterProveedores = () => {
        let results = proveedores;
        if (isActive && !isInactive) {
            results = results.filter(proveedor => proveedor.status === 'ACTIVE');
        } else if (!isActive && isInactive) {
            results = results.filter(proveedor => proveedor.status === 'INACTIVE');
        }
        if (searchTerm) {
            results = results.filter(proveedor =>
                proveedor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                proveedor.contact.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredProveedores(results);
    };

    const handleCheckboxChange = (type) => {
        if (type === 'active') {
            setIsActive(!isActive);
            setIsInactive(false); // Desmarca el otro checkbox
        } else if (type === 'inactive') {
            setIsInactive(!isInactive);
            setIsActive(false); // Desmarca el otro checkbox
        }
    };

    return (
        <div className="suppliers-container">
            <h2>Proveedores</h2>
            <div className="suppliers-search-section">
                <div className="suppliers-search-input">
                    <InputText
                        placeholder="Buscar proveedores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="suppliers-search-buttons">
                    <Button
                        label="Buscar"
                        icon="pi pi-search"
                        onClick={filterProveedores}
                        className="suppliers-button-search p-button-primary"
                    />
                    <Button
                        label="Limpiar"
                        icon="pi pi-times"
                        onClick={() => {
                            setSearchTerm('');
                            setIsActive(false);
                            setIsInactive(false);
                            setFilteredProveedores(proveedores);
                        }}
                        className="suppliers-button-clear p-button-secondary"
                    />
                </div>
                <div className="suppliers-checkbox-group">
                    <div className="suppliers-checkbox-item">
                        <Checkbox
                            inputId="active"
                            checked={isActive}
                            onChange={() => handleCheckboxChange('active')}
                        />
                        <label htmlFor="active">Activo</label>
                    </div>
                    <div className="suppliers-checkbox-item">
                        <Checkbox
                            inputId="inactive"
                            checked={isInactive}
                            onChange={() => handleCheckboxChange('inactive')}
                        />
                        <label htmlFor="inactive">Inactivo</label>
                    </div>
                </div>
            </div>


            <div className="suppliers-container">
                {/* Botón Agregar / Cancelar */}
                <div className="suppliers-toggle-form">
                    <Button
                        label={isFormVisible ? 'Cancelar' : 'Agregar Proveedor'}
                        icon={isFormVisible ? 'pi pi-times' : 'pi pi-plus'}
                        onClick={handleToggleForm}
                        className={isFormVisible ? 'suppliers-button-cancel p-button-danger' : 'suppliers-button-add p-button-success'}
                    />
                </div>

                {/* Formulario para Agregar / Editar */}
                {isFormVisible && (
                    <form className="suppliers-form" onSubmit={handleSubmit}>
                        <h3 className="suppliers-form-title">
                            {editingIndex !== null ? 'Editar Proveedor' : 'Agregar Proveedor'}
                        </h3>

                        {/* Fila 1: Nombre y Contacto */}
                        <div className="suppliers-form-row">
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="suppliers-input"
                                required
                            />
                            {nameError && <p className="suppliers-error-message">Nombre es requerido.</p>}
                            <input
                                type="text"
                                placeholder="Contacto"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                className="suppliers-input"
                                required
                            />
                            {contactError && <p className="suppliers-error-message">Contacto es requerido.</p>}
                        </div>

                        {/* Fila 2: Teléfono y Email */}
                        <div className="suppliers-form-row">
                            <input
                                type="tel"
                                placeholder="Teléfono"
                                value={phone}
                                onChange={(e) => {
                                    const newValue = e.target.value.replace(/\D/g, '');
                                    if (newValue.length <= 9) {
                                        setPhone(newValue);
                                    }
                                }}
                                className="suppliers-input"
                                required
                            />
                            {phoneError && <p className="suppliers-error-message">Teléfono es requerido.</p>}
                            <input
                                type="email"
                                placeholder="Correo Electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="suppliers-input"
                                required
                            />
                            {emailError && <p className="suppliers-error-message">Correo electrónico es requerido.</p>}
                        </div>

                        {/* Fila 4: Categoría y Estado */}
                        <div className="suppliers-form-row">
                            <select
                                value={categoryId || ""}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="suppliers-input"
                                required
                            >
                                <option value="" disabled>Selecciona una categoría</option>
                                {categories.map((category) => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                            {categoryIdError && <p className="suppliers-error-message">Categoría es requerida.</p>}

                            <select
                                value={status || ""}
                                onChange={(e) => setStatus(e.target.value)}
                                className="suppliers-input"
                                required
                            >
                                <option value="" disabled>Selecciona el estado</option>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                            {statusError && <p className="suppliers-error-message">Estado es requerido.</p>}

                        </div>

                        {/* Botón Guardar */}
                        <div className="suppliers-button-submit-container">
                            <button
                                type="submit"
                                className="suppliers-button-submit"
                            >
                                {editingIndex !== null ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
                            </button>
                        </div>
                    </form>
                )}


            </div>

            <div className="suppliers-table-container" style={{ marginTop: '2rem' }}>
                <DataTable
                    value={filteredProveedores}
                    responsiveLayout="scroll"
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25]}
                    className="suppliers-datatable"
                >
                    <Column field="name" header="Nombre" sortable headerClassName="suppliers-header" bodyClassName="suppliers-body" />
                    <Column field="contact" header="Contacto" sortable headerClassName="suppliers-header" bodyClassName="suppliers-body" />
                    <Column field="phone" header="Teléfono" sortable headerClassName="suppliers-header" bodyClassName="suppliers-body" />
                    <Column field="email" header="Email" sortable headerClassName="suppliers-header" bodyClassName="suppliers-body" />
                    <Column field="address" header="Dirección" sortable headerClassName="suppliers-header" bodyClassName="suppliers-body" />
                    <Column field="conditions" header="Condiciones" sortable headerClassName="suppliers-header" bodyClassName="suppliers-body" />
                    <Column
                        body={(rowData, rowProps) => (
                            <>
                                <Button
                                    icon="pi pi-pencil"
                                    label="Editar"
                                    className="suppliers-button-edit p-button-rounded p-button-text"
                                    onClick={() => handleEdit(rowProps.rowIndex)}
                                />
                                <Button
                                    icon="pi pi-trash"
                                    label="Eliminar"
                                    className="suppliers-button-delete p-button-rounded p-button-text"
                                    severity="danger"
                                    onClick={() => handleDelete(rowProps.rowIndex)}
                                />
                            </>
                        )}
                        headerClassName="suppliers-header"
                        bodyClassName="suppliers-body"
                    />
                </DataTable>
            </div>
        </div>
    );
};


export default Suppliers;
