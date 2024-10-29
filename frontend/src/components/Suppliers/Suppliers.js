import React, { useState, useEffect } from 'react';
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';  // Usamos Dropdown para los combos
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './Suppliers.css';

const Suppliers = () => {
    const [proveedores, setProveedores] = useState([]);
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [conditions, setConditions] = useState('');
    const [categoryId, setCategoryId] = useState(null);  // Para el combo de categorías
    const [status, setStatus] = useState('ACTIVE');  // Estado inicial de 'ACTIVE'
    const [editingIndex, setEditingIndex] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [categories, setCategories] = useState([
        { label: 'Categoría 1', value: 1 },
        { label: 'Categoría 2', value: 2 },
        { label: 'Categoría 3', value: 3 }
    ]);  // Simulación de categorías

    useEffect(() => {
        const storedProveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
        setProveedores(storedProveedores);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevoProveedor = { name, contact, phone, email, address, conditions, categoryId, status };

        if (editingIndex !== null) {
            const updatedProveedores = proveedores.map((proveedor, i) => (i === editingIndex ? nuevoProveedor : proveedor));
            setProveedores(updatedProveedores);
            setEditingIndex(null);
        } else {
            setProveedores([...proveedores, nuevoProveedor]);
        }

        // Limpiar campos
        setName('');
        setContact('');
        setPhone('');
        setEmail('');
        setAddress('');
        setConditions('');
        setCategoryId(null);
        setStatus('ACTIVE');
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
    };

    return (
        <div className="suppliers-container">
            <h2>Proveedores</h2>
            <div className="search-container">
                <InputText
                    placeholder="Buscar proveedores..."
                    className="search-input"
                />
                <Button
                    label={isFormVisible ? 'Cancelar' : 'Agregar Proveedor'}
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    className="toggle-button"
                />
            </div>

            {isFormVisible && (
                <form onSubmit={handleSubmit} className="suppliers-form">
                    <h2>{editingIndex !== null ? 'Editar Proveedor' : 'Agregar Proveedor'}</h2>
                    <InputField label="Nombre" value={name} onChange={setName} required />
                    <InputField label="Contacto" value={contact} onChange={setContact} required />
                    <InputField label="Teléfono" value={phone} onChange={setPhone} required />
                    <InputField label="Email" type="email" value={email} onChange={setEmail} required />
                    <InputField label="Dirección" value={address} onChange={setAddress} />
                    <InputField label="Condiciones" value={conditions} onChange={setConditions} />
                    <div className="form-group">
                        <label>Categoría</label>
                        <Dropdown value={categoryId} options={categories} onChange={(e) => setCategoryId(e.value)} placeholder="Selecciona una categoría" />
                    </div>
                    <div className="form-group">
                        <label>Estado</label>
                        <Dropdown value={status} options={[{ label: 'ACTIVE', value: 'ACTIVE' }, { label: 'INACTIVE', value: 'INACTIVE' }]} onChange={(e) => setStatus(e.value)} placeholder="Selecciona el estado" />
                    </div>
                    <Button
                        type="submit"
                        label={editingIndex !== null ? 'Actualizar Proveedor' : 'Agregar Proveedor'}
                        className="w-full mt-4"
                        severity="success"
                    />
                </form>
            )}

            <div className="table-container">
                <DataTable
                    value={proveedores}
                    responsiveLayout="scroll"
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25]}
                >
                    <Column field="name" header="Nombre" sortable></Column>
                    <Column field="contact" header="Contacto" sortable></Column>
                    <Column field="phone" header="Teléfono" sortable></Column>
                    <Column field="email" header="Email" sortable></Column>
                    <Column field="address" header="Dirección" sortable></Column>
                    <Column field="conditions" header="Condiciones" sortable></Column>
                    <Column field="categoryId" header="Categoría" sortable></Column>
                    <Column field="status" header="Estado" sortable></Column>
                    <Column
                        header="Acciones"
                        body={(rowData, { rowIndex }) => (
                            <div className="flex justify-center space-x-2">
                                <Button
                                    label="Editar"
                                    icon="pi pi-pencil"
                                    onClick={() => handleEdit(rowIndex)}
                                    className="p-button-rounded p-button-info edit-button"
                                />
                                <Button
                                    label="Eliminar"
                                    icon="pi pi-trash"
                                    onClick={() => handleDelete(rowIndex)}
                                    className="p-button-rounded p-button-danger delete-button"
                                />
                            </div>
                        )}
                        style={{ textAlign: 'center', width: '15%' }}
                    />
                </DataTable>
            </div>
        </div>
    );
};

// Componente reutilizable InputField
const InputField = ({ label, type = "text", value, onChange, required }) => (
    <div className="form-group">
        <label>{label}</label>
        <InputText
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className="input-field"
        />
    </div>
);

export default Suppliers;
