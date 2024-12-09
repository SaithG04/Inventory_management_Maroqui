import React from 'react';
import './CrearPedidoForm.css';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const CrearPedidoForm = ({
  nuevoPedido,
  estadoOpciones,
  onChange,
  onSubmit,
  onCancel,
  onAgregarProducto,
  productosFiltrados,
  productoSeleccionado,
  onProductoSeleccionado,
  onCantidadChange,
  onProductoEliminar,
  onProductoEditar,
  editandoProducto,
}) => {
  return (
    <div className="crear-pedido-form">
      <div className="form-section">
        <h3>Datos del Proveedor</h3>
        <input
          type="text"
          placeholder="Proveedor"
          value={nuevoPedido.proveedor}
          onChange={(e) => onChange(e, 'proveedor')}
        />
        <Dropdown
          value={nuevoPedido.status}
          options={estadoOpciones}
          onChange={(e) => onChange(e, 'status')}
          placeholder="Estado del Pedido"
        />
      </div>
      <div className="form-section">
        <h3>Agregar Producto</h3>
        <input
          type="text"
          placeholder="Producto"
          value={productoSeleccionado.nombre}
          onChange={onProductoSeleccionado}
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={productoSeleccionado.cantidad || 0}
          onChange={onCantidadChange}
        />
        <Button
          label={editandoProducto ? 'Actualizar Producto' : 'Agregar Producto'}
          onClick={onAgregarProducto}
        />
      </div>
      <div className="form-section">
        <h3>Lista de Productos</h3>
        <ul>
          {nuevoPedido.productos.map((producto, index) => (
            <li key={index}>
              {producto.nombre} - {producto.cantidad}
              <Button label="Editar" onClick={() => onProductoEditar(index)} />
              <Button label="Eliminar" onClick={() => onProductoEliminar(index)} />
            </li>
          ))}
        </ul>
      </div>
      <div className="form-actions">
        <Button label="Guardar Pedido" onClick={onSubmit} />
        <Button label="Cancelar" onClick={onCancel} />
      </div>
    </div>
  );
};

export default CrearPedidoForm;
