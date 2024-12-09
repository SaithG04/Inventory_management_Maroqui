import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [entries, setEntries] = useState([]);
    const [sales, setSales] = useState([]);

    useEffect(() => {
        const storedEntries = JSON.parse(localStorage.getItem('entries')) || [];
        const storedSales = JSON.parse(localStorage.getItem('sales')) || [];
        setEntries(storedEntries);
        setSales(storedSales);
    }, []);
    
    

    return (
        <div>
            <h2>Resumen de Entradas y Salidas</h2>
            <table>
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry) => (
                        <tr key={`entry-${entry.id}`}>
                            <td>Entrada</td>
                            <td>{entry.name}</td>
                            <td>{entry.stock}</td>
                            <td>{entry.date ? new Date(entry.date).toLocaleString() : 'Fecha no disponible'}</td>
                        </tr>
                    ))}
                    {sales.map((sale) => (
                        <tr key={`sale-${sale.id}`}>
                            <td>Salida</td>
                            <td>{sale.product}</td>
                            <td>{sale.quantity}</td>
                            <td>{sale.date ? new Date(sale.date).toLocaleString() : 'Fecha no disponible'}</td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default Dashboard;
