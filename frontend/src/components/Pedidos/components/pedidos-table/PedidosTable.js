import React from 'react';
import './PedidosTable.css';
import { Button } from 'primereact/button';

const PedidosTable = ({ pedidos, onEditar, onEliminar, onDetalles }) => {
  return (
    <div className="pedidos-table">
      <table>
        <thead>
          <tr>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Productos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido, index) => (
            <tr key={index}>
              <td>{pedido.proveedor}</td>
              <td>{pedido.fecha}</td>
              <td>{pedido.status}</td>
              <td>{pedido.productos.length}</td>
              <td>
                <Button label="Detalles" onClick={() => onDetalles(pedido)} />
                <Button label="Editar" onClick={() => onEditar(pedido)} />
                <Button label="Eliminar" onClick={() => onEliminar(index)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PedidosTable;
