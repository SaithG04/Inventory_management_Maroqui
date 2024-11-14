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
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const Pedidos = () => {
  const { products } = useContext(ProductContext);
  const [pedidosRealizados, setPedidosRealizados] = useState([]);
  const [editandoPedido, setEditandoPedido] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    fecha: '',
    proveedor: '',
    estado: 'pendiente',
    otrosEstados: { completado: false, cancelado: false },
  });
  const [nuevoPedido, setNuevoPedido] = useState({
    proveedor: '',
    status: '',
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

  const estadoOpciones = [
    { name: 'Pendiente', value: 'PENDIENTE' },
    { name: 'Procesado', value: 'PROCESADO' },
    { name: 'Cancelado', value: 'CANCELADO' },
  ];

  const registrarPedido = () => {
    if (!nuevoPedido.proveedor || !nuevoPedido.status) {
      toast.current.show({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Por favor, complete todos los campos obligatorios.',
        life: 3000,
      });
      return;
    }

    const pedido = {
      proveedor: nuevoPedido.proveedor,
      fecha: new Date().toLocaleDateString(),
      status: nuevoPedido.status || 'PENDIENTE', // Valor predeterminado
      productos: nuevoPedido.productos,
    };

    setPedidosRealizados((prevPedidos) => [...prevPedidos, pedido]);
    limpiarFormularioPedido();
    setMostrarFormulario(false);
  };




  const verDetallesPedido = (pedido) => {
    if (!pedido) {
      console.error('Pedido no encontrado');
      return;
    }

    // Limpia cualquier mensaje duplicado antes de mostrar uno nuevo
    toast.current.clear();

    toast.current.show({
      severity: 'info',
      summary: 'Detalles del Pedido',
      detail: `Proveedor: ${pedido.proveedor} - Estado: ${pedido.status} - Productos: ${pedido.productos.length}`,
      life: 3000,
    });
  };

  const enviarPedido = (pedido) => {
    const emailProveedor = proveedores.find((p) => p.name === pedido.proveedor)?.email;

    if (!emailProveedor) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se encontró un correo electrónico para este proveedor.',
        life: 3000,
      });
      return;
    }

    console.log(`Enviando correo a: ${emailProveedor}`);
    toast.current.show({
      severity: 'success',
      summary: 'Correo Enviado',
      detail: `Pedido enviado a ${emailProveedor}`,
      life: 3000,
    });
  };



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
      // Actualiza el producto existente
      setNuevoPedido((prevPedido) => {
        const productosActualizados = [...prevPedido.productos];
        productosActualizados[editandoIndex] = productoSeleccionado; // Reemplaza el producto editado
        return {
          ...prevPedido,
          productos: productosActualizados,
        };
      });
      setEditandoProducto(false); // Salir del modo edición
      setEditandoIndex(null); // Limpia el índice del producto editado
    } else {
      // Agrega un nuevo producto
      const productoExistente = nuevoPedido.productos.find(
        (producto) => producto.nombre.toLowerCase() === productoSeleccionado.nombre.toLowerCase()
      );

      if (productoExistente) {
        toast.current.show({ severity: 'warn', summary: 'Producto Duplicado', detail: 'El producto ya está en la lista del pedido.', life: 3000 });
        return;
      }

      setNuevoPedido((prevPedido) => ({
        ...prevPedido,
        productos: [...prevPedido.productos, productoSeleccionado],
      }));
    }

    // Limpia el formulario después de agregar o actualizar
    setProductoSeleccionado({ nombre: '', cantidad: 0 });
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
        toast.current.show({ severity: 'success', summary: 'Producto Eliminado', detail: 'El producto ha sido eliminado del pedido.', life: 3000 });
      },
    });
  };

  const editarProducto = (index) => {
    const productoAEditar = nuevoPedido.productos[index];
    setProductoSeleccionado(productoAEditar); // Cargar los datos del producto seleccionado
    setEditandoProducto(true); // Activar el modo edición
    setEditandoIndex(index); // Guardar el índice del producto que se está editando
  };


  const iniciarEdicionPedido = (pedido) => {
    setNuevoPedido(pedido);
    setMostrarFormulario(true); // Muestra el formulario para edición
    setEditandoPedido(true); // Asegura que el estado de edición se active
  };


  // Función para finalizar la edición
  const finalizarEdicionPedido = () => {
    setPedidosRealizados((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.proveedor === nuevoPedido.proveedor && pedido.fecha === nuevoPedido.fecha
          ? { ...nuevoPedido } // Reemplaza el pedido editado
          : pedido
      )
    );
    limpiarFormularioPedido();
    setEditandoPedido(false);
    setMostrarFormulario(false);
  };



  const toggleFormulario = () => {
    if (mostrarFormulario && (nuevoPedido.proveedor || nuevoPedido.productos.length > 0)) {
      confirmDialog({
        message: 'Hay datos ingresados en el formulario. ¿Seguro que deseas cancelar?',
        header: 'Confirmación de Cancelación',
        icon: 'pi pi-exclamation-triangle',
        acceptClassName: 'custom-accept-button',
        rejectClassName: 'custom-reject-button',
        accept: () => {
          limpiarFormularioPedido();
          setEditandoPedido(false); // Restaura el estado al cancelar
          setMostrarFormulario(false);
        },
        reject: () => { },
      });
    } else {
      setMostrarFormulario(!mostrarFormulario);
      setEditandoPedido(false); // Asegúrate de que no está en modo edición al abrir
    }
  };


  const limpiarFormularioPedido = () => {
    setNuevoPedido({
      proveedor: '',
      status: '',
      productos: [],
    });
    setProductoSeleccionado({ nombre: '', cantidad: 0 });
    setProductosFiltrados([]);
  };

  return (
    <div className="pedidos-container">
      <ConfirmDialog />
      <Toast ref={toast} />

      {/* Sección de Búsqueda */}
      <div className="pedidos-search-section">
        <div className="pedidos-search-row">
          <div className="p-inputgroup pedidos-search-proveedor">
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
        </div>

        <div className="pedidos-search-row">
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
      </div>

      {/* Botón para mostrar/ocultar el formulario */}
      <div className="pedidos-crear-pedido-section">
        <Button
          label={mostrarFormulario ? 'Cancelar' : 'Crear Pedido'}
          className="pedidos-crear-pedido-button"
          onClick={toggleFormulario}
        />
      </div>

      {/* Formulario Crear Pedido */}
      {mostrarFormulario && (
        <div className="pedidos-container">
          <div className="pedidos-proveedor-section">
            <div className="pedidos-column">
              <div className="pedidos-row">
                {/* Datos del Proveedor */}
                <div className="pedidos-column">
                  <h3>Datos del Proveedor</h3>
                  <div className="pedidos-proveedor-input-container">
                    <input
                      id="proveedor"
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
                </div>

                {/* Estado del Pedido */}
                <div className="pedidos-column">
                  <h3>Estado del Pedido</h3>
                  <div className="pedidos-status-section">
                    <Dropdown
                      className="pedidos-status-dropdown"
                      value={nuevoPedido.status}
                      options={estadoOpciones}
                      onChange={(e) => setNuevoPedido({ ...nuevoPedido, status: e.value })}
                      optionLabel="name"
                      placeholder="Seleccione el estado"
                    />
                  </div>
                </div>
              </div>

              {/* Datos del Producto */}
              <h3>Datos del Producto</h3>
              <div className="pedidos-producto-input-container">
                <input
                  id="producto"
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
                          setProductoSeleccionado({
                            ...productoSeleccionado,
                            nombre: product.name,
                          });
                          setProductosFiltrados([]);
                        }}
                        className="pedidos-autocomplete-item"
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span>{product.name}</span>
                          <span>Stock: {product.stock || 0}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="pedidos-producto-input-container">
                <label htmlFor="cantidad">Cantidad</label>
                <input
                  id="cantidad"
                  type="number"
                  placeholder="Cantidad"
                  value={productoSeleccionado.cantidad || 0}
                  onChange={handleCantidadChange}
                  className="pedidos-cantidad-input"
                />
              </div>
              <div className="pedidos-boton-centrado">
                <Button
                  label={editandoProducto ? 'Actualizar Producto' : 'Agregar Producto'}
                  icon={editandoProducto ? 'pi pi-refresh' : 'pi pi-plus'}
                  onClick={agregarProducto}
                  className="pedidos-agregar-producto-button"
                />
              </div>


              {/* Lista de productos en el pedido */}
              <h3>Lista de Productos</h3>
              <DataTable
                value={nuevoPedido.productos}
                responsiveLayout="scroll"
                emptyMessage="No hay productos en el pedido."
                className="pedidos-productos-lista"
              >
                <Column field="nombre" header="Producto" style={{ width: '40%' }}></Column>
                <Column field="cantidad" header="Cantidad" style={{ width: '20%' }}></Column>
                <Column
                  body={(rowData, options) => (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <Button
                        label="Editar"
                        icon="pi pi-pencil"
                        className="pedidos-editar-button"
                        onClick={() => {
                          confirmDialog({
                            message: `¿Estás seguro de que deseas editar el producto "${rowData.nombre}"?`,
                            header: 'Confirmación de Edición',
                            icon: 'pi pi-exclamation-triangle',
                            acceptClassName: 'p-button-danger',
                            rejectClassName: 'p-button-secondary',
                            accept: () => {
                              editarProducto(options.rowIndex);
                            },
                          });
                        }}
                      />
                      <Button
                        label="Eliminar"
                        icon="pi pi-trash"
                        className="pedidos-eliminar-button"
                        onClick={() => {
                          confirmDialog({
                            message: `¿Estás seguro de que deseas eliminar el producto "${rowData.nombre}"?`,
                            header: 'Confirmación de Eliminación',
                            icon: 'pi pi-exclamation-triangle',
                            acceptClassName: 'p-confirm-dialog-accep',
                            rejectClassName: 'p-confirm-dialog-reject',
                            accept: () => eliminarProducto(options.rowIndex),
                          });
                        }}
                      />
                    </div>
                  )}
                  style={{ width: '40%' }}
                ></Column>
              </DataTable>

              <div className="pedidos-boton-centrado">
                <Button
                  label={editandoPedido ? 'Actualizar Pedido' : 'Registrar Pedido'}
                  icon={editandoPedido ? 'pi pi-refresh' : 'pi pi-save'}
                  className="pedidos-registrar-pedido-button"
                  onClick={() => {
                    confirmDialog({
                      message: editandoPedido
                        ? '¿Estás seguro de que deseas actualizar este pedido?'
                        : '¿Estás seguro de que deseas registrar este pedido?',
                      header: 'Confirmación',
                      icon: 'pi pi-exclamation-triangle',
                      acceptClassName: 'p-button-success',
                      rejectClassName: 'p-button-secondary',
                      accept: () => (editandoPedido ? finalizarEdicionPedido() : registrarPedido()),
                    });
                  }}
                />
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Lista de Pedidos Realizados */}
      {!mostrarFormulario && (
        <div className="pedidos-realizados-section">
          <h3>Pedidos Realizados</h3>
          <DataTable
            value={pedidosRealizados}
            responsiveLayout="scroll"
            paginator
            rows={5}
            emptyMessage="No hay pedidos registrados."
          >
            <Column
              field="proveedor"
              header="Proveedor" sortable
              headerStyle={{ textAlign: 'left' }} /* Alinea el encabezado */
              bodyStyle={{ textAlign: 'left' }} /* Alinea el contenido */
              style={{ width: '20%' }}
            />
            <Column
              field="fecha"
              header="Fecha" sortable
              headerStyle={{ textAlign: 'left' }}
              bodyStyle={{ textAlign: 'left' }}
              style={{ width: '20%' }}
            />
            <Column
              field="status"
              header="Estado" sortable
              headerStyle={{ textAlign: 'left' }}
              bodyStyle={{ textAlign: 'left' }}
              style={{ width: '15%' }}
            />
            <Column
              field="resumen"
              header="Resumen"
              body={(rowData) => `${rowData.productos.length} productos`}
              headerStyle={{ textAlign: 'left' }}
              bodyStyle={{ textAlign: 'left' }}
              style={{ width: '20%' }}
            />
            <Column
              body={(rowData) => (
                <div style={{ display: 'flex', justifyContent: 'space-around', gap: '10px' }}>
                  <Button
                    label="Detalles"
                    icon="pi pi-info-circle"
                    className="p-button-detalles"
                    onClick={() => verDetallesPedido(rowData)} // Solo llamas a la función
                  />

                  <Button
                    label="Editar"
                    icon="pi pi-pencil"
                    className="p-button-editar"
                    onClick={() => {
                      confirmDialog({
                        message: `¿Estás seguro de que deseas editar el pedido del proveedor "${rowData.proveedor}"?`,
                        header: 'Confirmación de Edición',
                        icon: 'pi pi-exclamation-triangle',
                        acceptClassName: 'p-button-warning',
                        rejectClassName: 'p-button-secondary',
                        accept: () => iniciarEdicionPedido(rowData),
                      });
                    }}
                  />

                  <Button
                    label="Enviar Pedido"
                    icon="pi pi-send"
                    className="p-button-enviar"
                    onClick={() => {
                      confirmDialog({
                        message: `¿Estás seguro de que deseas enviar el pedido del proveedor "${rowData.proveedor}"?`,
                        header: 'Confirmación de Envío',
                        icon: 'pi pi-exclamation-triangle',
                        acceptClassName: 'p-button-success',
                        rejectClassName: 'p-button-secondary',
                        accept: () => enviarPedido(rowData),
                      });
                    }}
                  />

                </div>
              )}
              style={{ width: '25%' }}
            ></Column>
          </DataTable>
        </div>
      )}
    </div>
  );
};

export default Pedidos;
