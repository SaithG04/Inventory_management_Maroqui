import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import './AddSupplierForm.css';

const AddSupplierForm = ({ onSave, supplier = {}, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        phone: '',
        email: '',
        address: '',
        status: 'ACTIVE',
        ...supplier,
    });

    const handleChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form className="add-supplier-form" onSubmit={handleSubmit}>
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="name">Nombre</label>
                    <InputText
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange(e, 'name')}
                        placeholder="Nombre del proveedor"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="contact">Contacto</label>
                    <InputText
                        id="contact"
                        value={formData.contact}
                        onChange={(e) => handleChange(e, 'contact')}
                        placeholder="Persona de contacto"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="phone">Teléfono</label>
                    <InputText
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange(e, 'phone')}
                        placeholder="Teléfono"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="email">Correo Electrónico</label>
                    <InputText
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleChange(e, 'email')}
                        placeholder="Correo"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="address">Dirección</label>
                    <InputText
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleChange(e, 'address')}
                        placeholder="Dirección"
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="status">Estado</label>
                    <Dropdown
                        id="status"
                        value={formData.status}
                        options={[
                            { label: 'Activo', value: 'ACTIVE' },
                            { label: 'Inactivo', value: 'INACTIVE' },
                        ]}
                        onChange={(e) => handleChange(e, 'status')}
                        placeholder="Selecciona un estado"
                    />
                </div>
                <div className="form-buttons">
                    <Button type="submit" label="Guardar" className="p-button-success" />
                    <Button type="button" label="Cancelar" className="p-button-secondary" onClick={onCancel} />
                </div>
            </div>
        </form>
    );
};

export default AddSupplierForm;
