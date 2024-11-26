import React, { useState, useRef } from 'react';
import './Pedidos.css';
import SearchSection from './components/search-section/SearchSection';
import CrearPedidoForm from './components/crear-pedido-form/CrearPedidoForm';
import PedidosTable from './components/pedidos-table/PedidosTable';
import { Toast } from 'primereact/toast';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [nuevoPedido, setNuevoPedido] = useState({ proveedor: '', status: '', productos: [] });
  const [productoSeleccionado, setProductoSeleccionado] = useState({ nombre: '', cantidad: 0 });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoProducto, setEditandoProducto] = useState(false);
  const toast = useRef(null);

  const estadoOpciones = [
    { label: 'Pendiente', value: 'PENDIENTE' },
    { label: 'Procesado', value: 'PROCESADO' },
    { label: 'Cancelado', value: 'CANCELADO' },
  ];

  const registrarPedido = () => {
    setPedidos([...pedidos, nuevoPedido]);
    setNuevoPedido({ proveedor: '', status: '', productos: [] });
    setMostrarFormulario(false);
  };

  const editarPedido = (pedido) => {
    setNuevoPedido(pedido);
    setMostrarFormulario(true);
  };

  const eliminarPedido = (index) => {
    setPedidos(pedidos.filter((_, i) => i !== index));
  };

  const agregarProducto = () => {
    setNuevoPedido({
      ...nuevoPedido,
      productos: [...nuevoPedido.productos, productoSeleccionado],
    });
    setProductoSeleccionado({ nombre: '', cantidad: 0 });
  };

  return (
    <div className="pedidos-container">
      <Toast ref={toast} />
      <SearchSection filters={{}} onSearchChange={() => {}} />
      {mostrarFormulario ? (
        <CrearPedidoForm
          nuevoPedido={nuevoPedido}
          estadoOpciones={estadoOpciones}
          onSubmit={registrarPedido}
          onCancel={() => setMostrarFormulario(false)}
          onAgregarProducto={agregarProducto}
          productoSeleccionado={productoSeleccionado}
          productosFiltrados={[]}
          onProductoSeleccionado={(e) => setProductoSeleccionado({ nombre: e.target.value })}
          onCantidadChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, cantidad: e.target.value })}
          onProductoEliminar={(index) =>
            setNuevoPedido({
              ...nuevoPedido,
              productos: nuevoPedido.productos.filter((_, i) => i !== index),
            })
          }
          onProductoEditar={(index) => {
            setProductoSeleccionado(nuevoPedido.productos[index]);
            setEditandoProducto(true);
          }}
          editandoProducto={editandoProducto}
        />
      ) : (
        <PedidosTable
          pedidos={pedidos}
          onEditar={editarPedido}
          onEliminar={eliminarPedido}
          onDetalles={(pedido) => {
            toast.current.show({
              severity: 'info',
              summary: 'Detalles del Pedido',
              detail: `Proveedor: ${pedido.proveedor}`,
            });
          }}
        />
      )}
      <Button label={mostrarFormulario ? 'Cancelar' : 'Crear Pedido'} onClick={() => setMostrarFormulario(!mostrarFormulario)} />
    </div>
  );
};

export default Pedidos;
