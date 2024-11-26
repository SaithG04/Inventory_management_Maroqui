import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import './SupplierSearch.css';

const SupplierSearch = ({ onFilter }) => {
    const [term, setTerm] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isInactive, setIsInactive] = useState(false);

    const handleSearch = () => {
        onFilter(term, isActive, isInactive);
    };

    return (
        <div className="supplier-search">
            <InputText
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Buscar proveedores..."
            />
            <Checkbox
                inputId="active"
                checked={isActive}
                onChange={(e) => setIsActive(e.checked)}
            />
            <label htmlFor="active">Activo</label>
            <Checkbox
                inputId="inactive"
                checked={isInactive}
                onChange={(e) => setIsInactive(e.checked)}
            />
            <label htmlFor="inactive">Inactivo</label>
            <Button label="Buscar" onClick={handleSearch} />
        </div>
    );
};

export default SupplierSearch;
