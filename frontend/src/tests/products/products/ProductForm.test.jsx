import React, { createRef } from "react"; // Importa createRef aquí
import { within } from "@testing-library/react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductForm from "../../../domain/products/infraestructure/components/product_components/ProductForm";
import ProductService from "../../../domain/products/domain/services/ProductService";
import CategoryService from "../../../domain/products/domain/services/CategoryService";

// Mockear servicios
jest.mock("../../../domain/products/domain/services/ProductService");
jest.mock("../../../domain/products/domain/services/CategoryService");

jest.mock("primereact/toast", () => ({
  Toast: jest.fn(),
}));

const mockToast = {
  current: {
    show: jest.fn(), // Simula el método `show` del Toast
  },
};

describe("ProductForm", () => {
  const mockOnProductSaved = jest.fn();
  const mockOnCancel = jest.fn();
  let mockToast;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mockear métodos de servicios
    CategoryService.prototype.getAllCategories = jest
      .fn()
      .mockResolvedValue([
        { nombre: "Categoría 1" },
        { nombre: "Categoría 2" },
      ]);

    ProductService.prototype.getProductById = jest.fn().mockResolvedValue({
      nombre: "Producto Test",
      descripcion: "Descripción Test",
      unidad_medida: "UN",
      stock: 10,
      nombre_categoria: "Categoría 1",
      estado: "ACTIVE",
      precio_venta: "100.00",
    });

    ProductService.prototype.isProductNameUnique = jest.fn().mockResolvedValue([]);
    ProductService.prototype.createProduct = jest.fn();

    // Configurar mock del Toast
    mockToast = createRef(); // Ahora createRef estará disponible
    mockToast.current = {
      show: jest.fn(),
    };
  });


  it("debería llenar correctamente los campos y enviar el formulario", async () => {
    render(
      <ProductForm
        productId={null}
        onProductSaved={mockOnProductSaved}
        onCancel={mockOnCancel}
      />
    );

    // Llenar el campo de nombre
    const nameInput = screen.getByPlaceholderText("Nombre del Producto *");
    fireEvent.change(nameInput, { target: { value: "Nuevo Producto" } });
    expect(nameInput.value).toBe("Nuevo Producto");

    // Abrir el Dropdown para unidad de medida
    const unidadDropdown = screen.getByLabelText("Seleccione la Unidad de Medida *");
    fireEvent.click(unidadDropdown);

    // Seleccionar la opción "Unidad (UN)"
    const unidadOption = await screen.findByText("Unidad (UN)");
    fireEvent.click(unidadOption);

    // Llenar el campo de categoría
    const categoryDropdown = screen.getByLabelText("Seleccione la Categoría *");
    fireEvent.click(categoryDropdown);

    // Seleccionar la opción "Categoría 1"
    const categoryOption = await screen.findByText("Categoría 1");
    fireEvent.click(categoryOption);

    // Llenar el campo de precio
    const priceInput = screen.getByPlaceholderText("Precio de Venta (opcional)");
    fireEvent.change(priceInput, { target: { value: "150.50" } });
    expect(priceInput.value).toBe("150.50");

    // Llenar el campo de stock
    const stockInput = screen.getByPlaceholderText("Cantidad en Stock (ej.: 100)");
    fireEvent.change(stockInput, { target: { value: "10" } });
    expect(stockInput.value).toBe("10");

    // Enviar el formulario
    const submitButton = screen.getByText("Guardar");
    fireEvent.click(submitButton);

    // Validar que se llama al servicio de creación de producto
    await waitFor(() => {
      expect(ProductService.prototype.createProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: "Nuevo Producto",
          descripcion: "Sin descripción",
          unidad_medida: "UN",
          stock: 10,
          nombre_categoria: "Categoría 1",
          estado: "ACTIVE",
          precio_venta: "150.50",
        })
      );
    });

    // Validar que se llama a la función onProductSaved
    expect(mockOnProductSaved).toHaveBeenCalled();
  });

  test("Renderiza el formulario correctamente con valores predeterminados", async () => {
    render(
      <ProductForm
        productId={null}
        onProductSaved={mockOnProductSaved}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByPlaceholderText("Nombre del Producto *")).toHaveValue("");
    expect(screen.getByPlaceholderText("Descripción (opcional)")).toHaveValue("");
    expect(screen.getByPlaceholderText("Cantidad en Stock (ej.: 100)")).toHaveValue("0");
    expect(screen.getByPlaceholderText("Precio de Venta (opcional)")).toHaveValue("");

    await waitFor(() => {
      expect(CategoryService.prototype.getAllCategories).toHaveBeenCalled();
    });
  });

  test("Carga los datos del producto en modo edición", async () => {
    render(
      <ProductForm
        productId={"123"}
        onProductSaved={mockOnProductSaved}
        onCancel={mockOnCancel}
      />
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Nombre del Producto *")).toHaveValue("Producto Test");
      expect(screen.getByPlaceholderText("Descripción (opcional)")).toHaveValue("Descripción Test");
      expect(screen.getByPlaceholderText("Cantidad en Stock (ej.: 100)")).toHaveValue("10");
      expect(screen.getByPlaceholderText("Precio de Venta (opcional)")).toHaveValue("100.00");
    });
  });

  test("Llama a la función onCancel cuando se hace clic en Cancelar", () => {
    render(
      <ProductForm
        productId={null}
        onProductSaved={mockOnProductSaved}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test("Muestra errores cuando faltan campos obligatorios", async () => {
    render(
      <ProductForm
        productId={null}
        onProductSaved={jest.fn()}
        onCancel={jest.fn()}
        toastRef={mockToast} // Pasamos el mockToast como prop
      />
    );

    // Intentar enviar el formulario sin completar campos obligatorios
    const submitButton = screen.getByText("Guardar");
    fireEvent.click(submitButton);

    // Verifica que se llama al Toast con el mensaje de error correspondiente
    await waitFor(() => {
      expect(mockToast.current.show).toHaveBeenCalledWith({
        severity: "error",
        summary: "Error de Validación",
        detail: "El nombre del producto es obligatorio.",
      });
    });
  });

});
