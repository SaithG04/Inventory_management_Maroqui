import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import OrderService from '../../../domain/services/OrderService';
import { OrderDTO } from '../../dto/OrderDTO';
import './OrderSearch.css';

const OrderSearch = ({ onSearchResults }) => {
    const [searchType, setSearchType] = useState('supplier'); // Tipo de búsqueda: 'supplier' por defecto
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const orderService = useMemo(() => new OrderService(), []);

    const handleSearch = useCallback(async () => {
        setLoading(true);
        try {
            let response = [];

            // Realizar búsqueda según el tipo seleccionado
            if (searchType === 'supplier') {
                response = await orderService.getOrdersBySupplier(query);
            } else if (searchType === 'status') {
                response = await orderService.getOrdersByStatus(status);
            }

            // Verificar y validar la respuesta
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
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No orders found or invalid response structure.',
                    life: 3000,
                });
                onSearchResults([]);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error fetching results.',
                life: 3000,
            });
            onSearchResults([]);
        } finally {
            setLoading(false);
        }
    }, [searchType, query, status, orderService, onSearchResults]);

    const handleClearSearch = () => {
        setQuery('');
        setStatus('');
        onSearchResults([]);
    };

    return (
        <div className="order-search-section">
            <Toast ref={toast} /> {/* Agregamos el Toast aquí */}
            <div className="order-search-dropdown">
                <Dropdown
                    value={searchType}
                    options={[
                        { label: 'Supplier', value: 'supplier' },
                        { label: 'Status', value: 'status' },
                    ]}
                    onChange={(e) => setSearchType(e.value)}
                    placeholder="Select Search Type"
                />
            </div>
            <div className="order-input">
                {searchType === 'status' ? (
                    <Dropdown
                        value={status}
                        options={[
                            { label: 'Pending', value: 'PENDING' },
                            { label: 'Processed', value: 'PROCESSED' },
                            { label: 'Canceled', value: 'CANCELED' },
                        ]}
                        onChange={(e) => setStatus(e.value)}
                        placeholder="Select Status"
                    />
                ) : (
                    <InputText
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by Supplier"
                    />
                )}
            </div>
            <div className="search-clear-buttons">
                <Button
                    label={loading ? 'Searching...' : 'Search'}
                    onClick={handleSearch}
                    disabled={loading}
                    className="search-button"
                />
                <Button
                    label="Clear"
                    onClick={handleClearSearch}
                    disabled={loading}
                    className="clear-button"
                />
            </div>
        </div>
    );
};

export default OrderSearch;
