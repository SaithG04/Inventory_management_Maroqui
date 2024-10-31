import React, { useState, useEffect } from 'react';
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
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
    const [categoryId, setCategoryId] = useState(null);
    const [status, setStatus] = useState('ACTIVE');
    const [editingIndex, setEditingIndex] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda
    const [categories] = useState([
        { label: 'Categoría 1', value: 1 },
        { label: 'Categoría 2', value: 2 },
        { label: 'Categoría 3', value: 3 }
    ]);

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

        localStorage.setItem('proveedores', JSON.stringify([...proveedores, nuevoProveedor]));

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
        localStorage.setItem('proveedores', JSON.stringify(updatedProveedores));
    };

    // Filtrar proveedores según el término de búsqueda
    const filteredProveedores = proveedores.filter(proveedor =>
        proveedor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.contact.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    return (
        <div className="suppliers-container" style={{ width: '95%', maxWidth: '1200px', padding: '5rem', margin: '1 auto' }}>
            <h2>Proveedores</h2>
            <div className="search-container">
                <InputText
                    placeholder="Buscar proveedores..."
                    className="search-input"
                    value={searchTerm} // Vincula el valor del InputText al estado searchTerm
                    onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado con el valor de entrada
                />
                <Button
                    label={isFormVisible ? 'Cancelar' : 'Agregar Proveedor'}
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    className="toggle-button"
                    style={{ marginLeft: '45rem' }}
                />
            </div>

            {isFormVisible && (
                <form onSubmit={handleSubmit} className="suppliers-form">
                    <h2>{editingIndex !== null ? 'Editar Proveedor' : 'Agregar Proveedor'}</h2>
                    <div style={{ display: 'flex', gap: '4rem' }}>
                        <InputField label="Nombre" value={name} onChange={setName} required />
                        <InputField label="Contacto" value={contact} onChange={setContact} required />
                    </div>
                    <div style={{ display: 'flex', gap: '4rem' }}>
                        <InputField
                            label="Teléfono"
                            value={phone}
                            onChange={(e) => {
                                const newValue = e.replace(/\D/g, '');
                                if (newValue.length <= 9) {
                                    setPhone(newValue);
                                }
                            }}
                            type="tel"
                            required
                        />
                        <InputField label="Email" type="email" value={email} onChange={setEmail} required />
                    </div>
                    <div style={{ display: 'flex', gap: '4rem' }}>
                        <InputField label="Dirección" value={address} onChange={setAddress} />
                        <InputField label="Condiciones" value={conditions} onChange={setConditions} />
                    </div>

                    <div style={{ display: 'flex', gap: '5rem' }}>
                        <div className="form-group">
                            <label>Categoría</label>
                            <Dropdown value={categoryId} options={categories} onChange={(e) => setCategoryId(e.value)} placeholder="Selecciona una categoría" />
                        </div>
                        <div className="form-group">
                            <label>Estado</label>
                            <Dropdown value={status} options={[{ label: 'ACTIVE', value: 'ACTIVE' }, { label: 'INACTIVE', value: 'INACTIVE' }]} onChange={(e) => setStatus(e.value)} placeholder="Selecciona el estado" />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        label={editingIndex !== null ? 'Actualizar Proveedor' : 'Agregar Proveedor'}
                        className="w-full mt-4"
                        severity="success"
                    />
                </form>
            )}

            <div className="table-container" style={{ marginTop: '2rem', marginLeft: '-2rem' }} >
                <DataTable
                    value={filteredProveedores} // Muestra solo los proveedores filtrados
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
                            <div className="flex justify-center gap-4"> {/* Define el espaciado aquí */}
                                <Button
                                    label="Editar"
                                    icon="pi pi-pencil"
                                    onClick={() => handleEdit(rowIndex)}
                                    className="p-button-rounded p-button-info edit-button"
                                    style={{ textAlign: 'center', width: 'auto' }} // Ajusta el ancho al contenido
                                />
                                <Button
                                    label="Eliminar"
                                    icon="pi pi-trash"
                                    onClick={() => handleDelete(rowIndex)}
                                    className="p-button-rounded p-button-danger delete-button"
                                    style={{ textAlign: 'right', width: 'auto', marginLeft: '1rem' }} // Ajusta el ancho al contenido
                                />
                            </div>
                        )}
                        style={{ textAlign: 'right', width: '35%' }}
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
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className="input-field"
        />
    </div>
);

export default Suppliers;
