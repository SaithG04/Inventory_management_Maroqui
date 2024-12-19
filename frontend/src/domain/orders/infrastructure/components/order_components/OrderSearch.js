import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import OrderService from '../../../domain/services/OrderService';
import { OrderDTO } from '../../dto/OrderDTO';
import './OrderSearch.css';

const OrderSearch = ({ onSearchResults }) => {
    const [searchType, setSearchType] = useState(null); // Estado inicial sin selección
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('PENDING');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const orderService = useMemo(() => new OrderService(), []);

    const handleSearch = useCallback(async () => {
        setLoading(true);
        try {
            let response = [];

            if (searchType === 'supplier' && query) {
                response = await orderService.getOrdersBySupplier(query);
            } else if (searchType === 'status' && status) {
                response = await orderService.getOrdersByStatus(status);
            }

            if (response && Array.isArray(response)) {
                const orders = response
                    .map((orderData) => {
                        try {
                            const orderDTO = new OrderDTO(orderData);
                            return orderDTO.toDomain();
                        } catch (err) {
                            console.error('Error converting order to domain:', err);
                            return null;
                        }
                    })
                    .filter((order) => order !== null);

                onSearchResults(orders);
            } else {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Sin resultados',
                    detail: 'No se encontraron pedidos.',
                    life: 3000,
                });
                onSearchResults([]);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al obtener los resultados.',
                life: 3000,
            });
            onSearchResults([]);
        } finally {
            setLoading(false);
        }
    }, [searchType, query, status, orderService, onSearchResults]);

    const handleClearSearch = () => {
        setQuery('');
        setStatus('PENDING');
        setSearchType(null);
        onSearchResults([]);
    };

    return (
        <div className="order-search-section">
            <Toast ref={toast} />
            <div className="order-search-dropdown">
                <Dropdown
                    value={searchType}
                    options={[
                        { label: 'Proveedor', value: 'supplier', dataTestId: 'search-type-supplier' },
                        { label: 'Estado', value: 'status', dataTestId: 'search-type-status' },
                    ]}
                    onChange={(e) => setSearchType(e.value)}
                    placeholder="Seleccione tipo de búsqueda"
                    data-testid="search-type-dropdown"
                    itemTemplate={(option) => (
                        <span data-testid={option.dataTestId}>{option.label}</span>
                    )}
                />
            </div>
            <div className="order-input">
                {searchType === 'status' && (
                    <Dropdown
                        value={status}
                        options={[
                            { label: 'Pendiente', value: 'PENDING' },
                            { label: 'Procesado', value: 'PROCESSED' },
                            { label: 'Cancelado', value: 'CANCELED' },
                        ]}
                        onChange={(e) => setStatus(e.value)}
                        placeholder="Seleccione estado"
                        data-testid="status-dropdown"
                        optionLabel="label"
                        aria-label="Status Dropdown"
                    />
                )}
                {(!searchType || searchType === 'supplier') && (
                    <InputText
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ingrese nombre del proveedor"
                        aria-label="Search by Supplier"
                        className="name-input"
                        disabled={!searchType}
                    />
                )}
            </div>
            <div className="search-clear-buttons">
                <Button
                    label={loading ? 'Buscando...' : 'Buscar'}
                    onClick={handleSearch}
                    disabled={loading || !searchType || (searchType === 'supplier' && !query.trim())}
                    className="search-button"
                />
                <Button
                    label="Limpiar"
                    onClick={handleClearSearch}
                    disabled={loading}
                    className="clear-button"
                />
            </div>
        </div>
    );
};

export default OrderSearch;
