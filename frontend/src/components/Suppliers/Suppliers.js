import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './Suppliers.css';

const Suppliers = () => {
    const [proveedores, setProveedores] = useState([]);
    const [filteredProveedores, setFilteredProveedores] = useState([]);
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isInactive, setIsInactive] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        const storedProveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
        setProveedores(storedProveedores);
        setFilteredProveedores(storedProveedores);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !contact || !phone || !email || !address || !status) {
            toast.current.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor, complete todos los campos obligatorios.',
                life: 3000
            });
            return;
        }

        confirmDialog({
            message: '¿Estás seguro de que deseas guardar el proveedor?',
            header: 'Confirmación de Guardado',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'custom-accept-button',
            rejectClassName: 'custom-reject-button',
            accept: () => {
                const nuevoProveedor = { name, contact, phone, email, address, status };

                let updatedProveedores;

                if (editingIndex !== null) {
                    updatedProveedores = proveedores.map((proveedor, i) =>
                        i === editingIndex ? nuevoProveedor : proveedor
                    );
                    setEditingIndex(null);
                    toast.current.show({ severity: 'success', summary: 'Proveedor Actualizado', detail: 'Proveedor actualizado con éxito.', life: 3000 });
                } else {
                    updatedProveedores = [...proveedores, nuevoProveedor];
                    toast.current.show({ severity: 'success', summary: 'Proveedor Agregado', detail: 'Proveedor agregado con éxito.', life: 3000 });
                }

                setProveedores(updatedProveedores);
                setFilteredProveedores(updatedProveedores);
                localStorage.setItem('proveedores', JSON.stringify(updatedProveedores));
                resetForm();
                setIsFormVisible(false);
            },
            reject: () => { }
        });
    };

    const handleEdit = (index) => {
        confirmDialog({
            message: '¿Estás seguro de que deseas actualizar este proveedor?',
            header: 'Confirmación de Actualización',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            acceptClassName: 'custom-accept-button',
            rejectClassName: 'custom-reject-button',
            accept: () => {
                const proveedor = proveedores[index];
                setName(proveedor.name);
                setContact(proveedor.contact);
                setPhone(proveedor.phone);
                setEmail(proveedor.email);
                setAddress(proveedor.address);
                setStatus(proveedor.status);
                setEditingIndex(index);
                setIsFormVisible(true);
            },
            reject: () => { }
        });
    };

    const handleToggleStatus = (index) => {
        const updatedProveedores = proveedores.map((proveedor, i) =>
            i === index ? { ...proveedor, status: proveedor.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : proveedor
        );
        setProveedores(updatedProveedores);
        setFilteredProveedores(updatedProveedores);
        localStorage.setItem('proveedores', JSON.stringify(updatedProveedores));
        toast.current.show({ severity: 'success', summary: 'Estado Actualizado', detail: 'Estado del proveedor actualizado con éxito.', life: 3000 });
    };

    const handleToggleForm = () => {
        if (isFormVisible && (name || contact || phone || email || address)) {
            confirmDialog({
                message: 'Hay datos ingresados en el formulario. ¿Estás seguro de que deseas cancelar?',
                header: 'Confirmación de Cancelación',
                icon: 'pi pi-exclamation-triangle',
                acceptClassName: 'custom-accept-button',
                rejectClassName: 'custom-reject-button',
                accept: () => {
                    resetForm();
                    setIsFormVisible(false);
                },
                reject: () => { }
            });
        } else {
            setIsFormVisible(!isFormVisible);
        }
    };

    const resetForm = () => {
        setName('');
        setContact('');
        setPhone('');
        setEmail('');
        setAddress('');
        setStatus('');
        setEditingIndex(null);
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
            setIsInactive(false);
        } else if (type === 'inactive') {
            setIsInactive(!isInactive);
            setIsActive(false);
        }
    };

    return (
        <div className="suppliers-container">
            <ConfirmDialog />
            <Toast ref={toast} />

            <h2>Proveedores</h2>
            <div className="suppliers-search-section">
                <div className="p-inputgroup suppliers-search-input">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-search" />
                    </span>
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

            <div className="suppliers-toggle-form">
                <Button
                    label={isFormVisible ? 'Cancelar' : 'Agregar Proveedor'}
                    icon={isFormVisible ? 'pi pi-times' : 'pi pi-plus'}
                    onClick={handleToggleForm}
                    className={isFormVisible ? 'suppliers-button-cancel custom-reject-button' : 'suppliers-button-add custom-accept-button'}
                />
            </div>

            {isFormVisible && (
                <form className="suppliers-form" onSubmit={handleSubmit}>
                    <h3 className="suppliers-form-title">
                        {editingIndex !== null ? 'Editar Proveedor' : 'Agregar Proveedor'}
                    </h3>

                    <div className="suppliers-form-row">
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="suppliers-input"
                        />
                        <input
                            type="text"
                            placeholder="Contacto"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="suppliers-input"
                        />
                    </div>

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
                        />
                        <input
                            type="email"
                            placeholder="Correo Electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="suppliers-input"
                        />
                    </div>

                    <div className="suppliers-form-row">
                        <input
                            type="text"
                            placeholder="Dirección"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="suppliers-input"
                        />
                        <select
                            value={status || ""}
                            onChange={(e) => setStatus(e.target.value)}
                            className="suppliers-input"
                        >
                            <option value="" disabled>Selecciona el estado</option>
                            <option value="ACTIVE">Activo</option>
                            <option value="INACTIVE">Inactivo</option>
                        </select>
                    </div>

                    <div className="suppliers-button-submit-container" style={{ textAlign: 'center' }}>
                        <Button
                            type="submit"
                            label={editingIndex !== null ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
                            icon="pi pi-check"
                            className="custom-accept-button"
                            style={{ width: '250px' }}
                        />
                    </div>
                </form>
            )}

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
                    <Column field="phone" header="Teléfono" headerClassName="suppliers-header" bodyClassName="suppliers-body" />
                    <Column field="email" header="Email" headerClassName="suppliers-header" bodyClassName="suppliers-body" />
                    <Column field="address" header="Dirección" headerClassName="suppliers-header" bodyClassName="suppliers-body" />
                    <Column field="status" header="Estado" sortable headerClassName="suppliers-header" bodyClassName="suppliers-body" />
                    <Column
                        body={(rowData, rowProps) => (
                            <div className="suppliers-button-container">
                                <Button
                                    icon="pi pi-pencil"
                                    label="Editar"
                                    className="suppliers-button suppliers-button-edit"
                                    onClick={() => handleEdit(rowProps.rowIndex)}
                                />
                                <Button
                                    label={rowData.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
                                    icon="pi pi-user-edit"
                                    className="suppliers-button suppliers-button-toggle"
                                    data-status={rowData.status}
                                    onClick={() => handleToggleStatus(rowProps.rowIndex)}
                                />

                            </div>
                        )}
                    />
                </DataTable>
            </div>
        </div>
    );
};

export default Suppliers;
