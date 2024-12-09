import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import EmployeeService from '../../../domain/services/EmployeeService';
import { EmployeeDTO } from '../../dto/EmployeeDTO';
import './EmployeeSearch.css';

const EmployeeSearch = ({ onSearchResults }) => {
    const [searchType, setSearchType] = useState('name'); // Tipo de búsqueda: 'name' por defecto
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const employeeService = useMemo(() => new EmployeeService(), []);

    const handleSearch = useCallback(async () => {
        setLoading(true);
        try {
            let response = [];

            // Realizar búsqueda según el tipo seleccionado
            if (searchType === 'name') {
                response = await employeeService.findByName(query, 0, 15);
            } else if (searchType === 'status') {
                response = await employeeService.findByStatus(status, 0, 15);
            }

            // Verificar y validar la respuesta
            if (response && Array.isArray(response.data)) {
                const employees = response.data
                    .map((employeeData) => {
                        try {
                            const employeeDTO = new EmployeeDTO(employeeData);
                            return employeeDTO.toDomain();
                        } catch (err) {
                            console.error("Error converting employee to domain:", err);
                            return null;
                        }
                    })
                    .filter((employee) => employee !== null);

                onSearchResults(employees);
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No employees found or invalid response structure.', life: 3000 });
                onSearchResults([]);
            }
        } catch (err) {
            console.error("Error fetching employees:", err);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error fetching results.', life: 3000 });
            onSearchResults([]);
        } finally {
            setLoading(false);
        }
    }, [searchType, query, status, employeeService, onSearchResults]);

    const handleClearSearch = () => {
        setQuery('');
        setStatus('');
        onSearchResults([]);
    };

    return (
        <div className="employee-search-section">
            <Toast ref={toast} />

            <div className="employee-search-dropdown">
                <label>
                    <Dropdown
                        value={searchType}
                        options={[
                            { label: 'Name', value: 'name' },
                            { label: 'Status', value: 'status' },
                        ]}
                        onChange={(e) => setSearchType(e.value)}
                        placeholder="Select Search Type"
                    />
                </label>
            </div>

            {/* Mostrar input o dropdown dependiendo del tipo de búsqueda */}
            {searchType === 'status' ? (
                <div className="employee-input">
                    <label>
                        <Dropdown
                            value={status}
                            options={[
                                { label: 'Active', value: 'ACTIVE' },
                                { label: 'Inactive', value: 'INACTIVE' },
                            ]}
                            onChange={(e) => setStatus(e.value)}
                            placeholder="Select Status"
                        />
                    </label>
                </div>
            ) : (
                <div className="employee-input">
                    <InputText
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by Name"
                    />
                </div>
            )}

            {/* Botones de búsqueda y limpiar */}
            <div className="search-clear-buttons"> {/* Usar la clase global del contenedor */}
                <Button
                    label={loading ? 'Searching...' : 'Search'} // Cambia el texto dinámicamente
                    onClick={handleSearch} // Evento de búsqueda
                    disabled={loading} // Desactiva el botón si está cargando
                    className="search-button" // Clase global para el botón de búsqueda
                />
                <Button
                    label="Clear" // Texto del botón de limpiar
                    onClick={handleClearSearch} // Evento para limpiar
                    disabled={loading} // Desactiva el botón si está cargando
                    className="clear-button" // Clase global para el botón de limpiar
                />
            </div>
        </div>
    );
};

export default EmployeeSearch;
