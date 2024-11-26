import React from 'react';
import './SearchSection.css';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';

const SearchSection = ({ filters, onSearchChange, onEstadoChange, onClear }) => {
  return (
    <div className="pedidos-search-section">
      <div className="pedidos-search-row">
        <InputText
          placeholder="Buscar Proveedor"
          value={filters.proveedor}
          onChange={(e) => onSearchChange(e)}
          name="proveedor"
        />
        <input
          type="date"
          value={filters.fecha}
          onChange={(e) => onSearchChange(e)}
          name="fecha"
        />
        <Checkbox
          inputId="completado"
          checked={filters.estado === 'completado'}
          onChange={() => onEstadoChange('completado')}
        />
        <label htmlFor="completado">Completado</label>
        <Checkbox
          inputId="cancelado"
          checked={filters.estado === 'cancelado'}
          onChange={() => onEstadoChange('cancelado')}
        />
        <label htmlFor="cancelado">Cancelado</label>
        <Button label="Limpiar" onClick={onClear} />
      </div>
    </div>
  );
};

export default SearchSection;
