import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import AddSupplierForm from './components/add-supplier-form/AddSupplierForm';
import SupplierSearch from './components/supplier-search/SupplierSearch';
import SupplierTable from './components/supplier-table/SupplierTable';
import './SuppliersManagement.css';

const SuppliersManagement = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        const storedSuppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
        setSuppliers(storedSuppliers);
        setFilteredSuppliers(storedSuppliers);
    }, []);

    const saveSupplier = (supplier) => {
        const updatedSuppliers = editingSupplier
            ? suppliers.map((s) => (s.id === editingSupplier.id ? supplier : s))
            : [...suppliers, { ...supplier, id: Date.now() }];

        setSuppliers(updatedSuppliers);
        setFilteredSuppliers(updatedSuppliers);
        localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));
        setEditingSupplier(null);
        setShowForm(false);
        toast.current.show({
            severity: 'success',
            summary: 'Éxito',
            detail: editingSupplier ? 'Proveedor actualizado' : 'Proveedor agregado',
            life: 3000,
        });
    };

    const editSupplier = (supplier) => {
        setEditingSupplier(supplier);
        setShowForm(true);
    };

    const deleteSupplier = (id) => {
        const updatedSuppliers = suppliers.filter((s) => s.id !== id);
        setSuppliers(updatedSuppliers);
        setFilteredSuppliers(updatedSuppliers);
        localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));
        toast.current.show({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Proveedor eliminado correctamente',
            life: 3000,
        });
    };

    const filterSuppliers = (term, active, inactive) => {
        let results = suppliers;
        if (active && !inactive) {
            results = results.filter((s) => s.status === 'ACTIVE');
        } else if (!active && inactive) {
            results = results.filter((s) => s.status === 'INACTIVE');
        }
        if (term) {
            results = results.filter(
                (s) =>
                    s.name.toLowerCase().includes(term.toLowerCase()) ||
                    s.contact.toLowerCase().includes(term.toLowerCase())
            );
        }
        setFilteredSuppliers(results);
    };

    return (
        <div className="suppliers-management">
            <Toast ref={toast} />
            <ConfirmDialog />
            <h1>Gestión de Proveedores</h1>
            <SupplierSearch onFilter={filterSuppliers} />
            {showForm ? (
                <AddSupplierForm
                    onSave={saveSupplier}
                    supplier={editingSupplier}
                    onCancel={() => setShowForm(false)}
                />
            ) : (
                <button onClick={() => setShowForm(true)}>Agregar Proveedor</button>
            )}
            <SupplierTable
                suppliers={filteredSuppliers}
                onEdit={editSupplier}
                onDelete={deleteSupplier}
            />
        </div>
    );
};

export default SuppliersManagement;
