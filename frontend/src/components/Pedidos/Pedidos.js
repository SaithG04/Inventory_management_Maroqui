import React, { useState, useContext, useEffect, useRef } from 'react';
import './Pedidos.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { ProductContext } from '../../context/ProductContext';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const Pedidos = () => {
  const { products } = useContext(ProductContext);
  const [proveedores, setProveedores] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    fecha: '',
    proveedor: '',
    estado: 'pendiente',
    otrosEstados: { completado: false, cancelado: false },
  });
  const [nuevoPedido, setNuevoPedido] = useState({
    proveedor: '',
    telefono: '',
    direccion: '',
    email: '',
    productos: [],
  });
  const [productoSeleccionado, setProductoSeleccionado] = useState({
    nombre: '',
    cantidad: 0,
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [editandoProducto, setEditandoProducto] = useState(false);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    const storedProveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
    setProveedores(storedProveedores);
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleEstadoChange = (estado) => {
    setSearchFilters((prevFilters) => ({
      ...prevFilters,
      estado: prevFilters.estado === estado ? '' : estado,
    }));
  };

  const handleProveedorChange = (e) => {
    const proveedorSeleccionado = e.target.value;

    setNuevoPedido((prevPedido) => ({
      ...prevPedido,
      proveedor: proveedorSeleccionado,
    }));

    if (proveedorSeleccionado) {
      const proveedoresFiltrados = proveedores.filter((proveedor) =>
        proveedor.name.toLowerCase().includes(proveedorSeleccionado.toLowerCase())
      );
      setProveedoresFiltrados(proveedoresFiltrados);
    } else {
      setProveedoresFiltrados([]);
    }
  };

  const seleccionarProveedor = (proveedor) => {
    setNuevoPedido((prevPedido) => ({
      ...prevPedido,
      proveedor: proveedor.name,
      telefono: proveedor.phone,
      direccion: proveedor.address,
      email: proveedor.email,
    }));
    setProveedoresFiltrados([]);
  };

  const handleProductoSeleccionado = (e) => {
    const productoSeleccionado = e.target.value;

    setProductoSeleccionado((prevProducto) => ({
      ...prevProducto,
      nombre: productoSeleccionado,
    }));

    if (productoSeleccionado && typeof productoSeleccionado === 'string') {
      const productosFiltrados = products.filter((producto) =>
        producto.name && producto.name.toLowerCase().includes(productoSeleccionado.toLowerCase())
      );
      setProductosFiltrados(productosFiltrados);
    } else {
      setProductosFiltrados([]);
    }
  };

  const handleCantidadChange = (e) => {
    setProductoSeleccionado((prevProducto) => ({ ...prevProducto, cantidad: parseInt(e.target.value) }));
  };

  const agregarProducto = () => {
    if (!productoSeleccionado.nombre || productoSeleccionado.cantidad <= 0) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Complete todos los campos antes de agregar el producto.', life: 3000 });
      return;
    }

    if (editandoProducto) {
      setNuevoPedido((prevPedido) => {
        const productosActualizados = [...prevPedido.productos];
        productosActualizados[editandoIndex] = productoSeleccionado;
        return {
          ...prevPedido,
          productos: productosActualizados,
        };
      });
      setEditandoProducto(false);
      setEditandoIndex(null);
    } else {
      setNuevoPedido((prevPedido) => ({
        ...prevPedido,
        productos: [...prevPedido.productos, productoSeleccionado],
      }));
    }

    setProductoSeleccionado({ nombre: '', cantidad: 0 });
    setProductosFiltrados([]);
  };

  const eliminarProducto = (index) => {
    confirmDialog({
      message: '¿Estás seguro de que deseas eliminar este producto?',
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'custom-accept-button',
      rejectClassName: 'custom-reject-button',
      accept: () => {
        setNuevoPedido((prevPedido) => ({
          ...prevPedido,
          productos: prevPedido.productos.filter((_, i) => i !== index),
        }));
        toast.current.show({ severity: 'success', summary: 'Producto Eliminado', detail: 'El producto ha sido eliminado de la lista.', life: 3000 });
      },
    });
  };

  const editarProducto = (index) => {
    confirmDialog({
      message: '¿Estás seguro de que deseas editar este producto?',
      header: 'Confirmación de Edición',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'custom-accept-button',
      rejectClassName: 'custom-reject-button',
      accept: () => {
        const productoAEditar = nuevoPedido.productos[index];
        setProductoSeleccionado(productoAEditar);
        setEditandoProducto(true);
        setEditandoIndex(index);
      },
    });
  };

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  return (
    <div className="pedidos-container">
      <ConfirmDialog />
      <Toast ref={toast} />

      {/* Sección de Búsqueda */}
      <div className="pedidos-search-section">
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <i className="pi pi-search" />
          </span>
          <InputText
            className="pedidos-search-input"
            type="text"
            name="proveedor"
            placeholder="Buscar Proveedor"
            value={searchFilters.proveedor}
            onChange={handleSearchChange}
          />
        </div>
        <input
          className="pedidos-search-input"
          type="date"
          name="fecha"
          value={searchFilters.fecha}
          onChange={handleSearchChange}
        />
        <div className="pedidos-checkbox-group">
          <div className="pedidos-checkbox-item">
            <Checkbox
              inputId="completado"
              checked={searchFilters.estado === 'completado'}
              onChange={() => handleEstadoChange('completado')}
            />
            <label htmlFor="completado">Completado</label>
          </div>
          <div className="pedidos-checkbox-item">
            <Checkbox
              inputId="cancelado"
              checked={searchFilters.estado === 'cancelado'}
              onChange={() => handleEstadoChange('cancelado')}
            />
            <label htmlFor="cancelado">Cancelado</label>
          </div>
        </div>
        <Button label="Buscar" className="pedidos-search-button" />
        <Button label="Limpiar" className="pedidos-clear-button" />
      </div>

      {/* Botón para mostrar/ocultar el formulario de crear pedido */}
      <div className="pedidos-crear-pedido-section">
        <Button
          label={mostrarFormulario ? "Cancelar" : "Crear Pedido"}
          className="pedidos-crear-pedido-button"
          onClick={toggleFormulario}
        />
      </div>

      {/* Formulario Crear Pedido */}
      {mostrarFormulario && (
        <div className="pedidos-proveedor-section">
          <div className="pedidos-form-columns">
            <div className="pedidos-proveedor-input-container">
              <input
                type="text"
                placeholder="Nombre del proveedor"
                value={nuevoPedido.proveedor}
                onChange={handleProveedorChange}
                className="pedidos-proveedor-input"
              />
              {proveedoresFiltrados.length > 0 && (
                <ul className="pedidos-autocomplete-list">
                  {proveedoresFiltrados.map((proveedor, index) => (
                    <li
                      key={index}
                      onClick={() => seleccionarProveedor(proveedor)}
                      className="pedidos-autocomplete-item"
                    >
                      {proveedor.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input
              type="text"
              placeholder="Teléfono"
              value={nuevoPedido.telefono || ''}
              readOnly
              className="pedidos-proveedor-telefono"
            />
          </div>
          <div className="pedidos-form-columns">
            <input
              type="text"
              placeholder="Dirección"
              value={nuevoPedido.direccion || ''}
              readOnly
              className="pedidos-proveedor-direccion"
            />
            <input
              type="text"
              placeholder="Email"
              value={nuevoPedido.email || ''}
              readOnly
              className="pedidos-proveedor-email"
            />
          </div>
          <div className="pedidos-form-columns">
            <div className="pedidos-producto-input-container">
              <input
                type="text"
                placeholder="Producto"
                value={productoSeleccionado.nombre}
                onChange={handleProductoSeleccionado}
                className="pedidos-producto-input"
              />
              {productosFiltrados.length > 0 && (
                <ul className="pedidos-autocomplete-list">
                  {productosFiltrados.map((product, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setProductoSeleccionado({ ...productoSeleccionado, nombre: product.name });
                        setProductosFiltrados([]);
                      }}
                    >
                      {product.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input
              type="number"
              placeholder="Cantidad"
              value={productoSeleccionado.cantidad || 0}
              onChange={handleCantidadChange}
              className="pedidos-cantidad-input"
            />
          </div>
          <Button
            label={editandoProducto ? "Actualizar Producto" : "Agregar Producto"}
            icon="pi pi-plus"
            onClick={agregarProducto}
            className="pedidos-agregar-producto-button"
          />
        </div>
      )}

      {/* Lista de Productos del Pedido */}
      {mostrarFormulario && nuevoPedido.productos.length > 0 && (
        <div className="pedidos-productos-pedido-section">
          <h3>Lista de Productos</h3>
          <DataTable value={nuevoPedido.productos} removableSort tableStyle={{ minWidth: '50rem' }}>
            <Column field="nombre" header="Producto" sortable style={{ width: '50%' }}></Column>
            <Column field="cantidad" header="Cantidad" sortable style={{ width: '25%' }}></Column>
            <Column
              header="Acciones"
              body={(rowData, options) => (
                <div>
                  <Button
                    label="Editar"
                    icon="pi pi-pencil"
                    className="pedidos-editar-button"
                    onClick={() => editarProducto(options.rowIndex)}
                  />
                  <Button
                    label="Eliminar"
                    icon="pi pi-trash"
                    className="pedidos-eliminar-button"
                    onClick={() => eliminarProducto(options.rowIndex)}
                  />
                </div>
              )}
              style={{ width: '25%' }}
            />
          </DataTable>
          <Button label="Registrar Pedido" className="pedidos-registrar-pedido-button" />
        </div>
      )}

      {/* Lista de Pedidos Realizados */}
      {!mostrarFormulario && (
        <div className="pedidos-realizados-section">
          <h3>Pedidos Realizados</h3>
          {/* Aquí se mostrarán los pedidos realizados previamente */}
        </div>
      )}
    </div>
  );
};

export default Pedidos;
