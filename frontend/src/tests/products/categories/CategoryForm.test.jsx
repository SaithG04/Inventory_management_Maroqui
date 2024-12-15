import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event'; // Asegúrate de importar userEvent
import CategoryForm from "../../../domain/products/infraestructure/components/category_components/CategoryForm";
import CategoryService from "../../../domain/products/domain/services/CategoryService";
import debounce from "lodash.debounce"; // Mockea debounce para evitar problemas en la prueba

jest.mock("../../../domain/products/domain/services/CategoryService");
jest.mock("lodash.debounce", () =>
  jest.fn((fn) => fn) // Mockea debounce para ejecutar inmediatamente la función
);
describe("CategoryForm", () => {
  const mockOnCategorySaved = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock del servicio
    CategoryService.prototype.getAllCategories = jest
      .fn()
      .mockResolvedValue([]);
    CategoryService.prototype.createCategory = jest.fn();
    CategoryService.prototype.updateCategory = jest.fn();

     // Mock de los servicios de Category
     CategoryService.prototype.createCategory = jest.fn().mockResolvedValue({
      id: "1",
      nombre: "Nueva categoría",
    });
    CategoryService.prototype.updateCategory = jest.fn().mockResolvedValue({
      id: "1",
      nombre: "Categoría actualizada",
    });
  });

  it("Valida que el nombre sea obligatorio antes de enviar el formulario", async () => {
    render(
      <CategoryForm
        categoryId={null}
        initialData={null}
        onCategorySaved={mockOnCategorySaved}
        onCancel={mockOnCancel}
      />
    );
  
    // Deja el campo "nombre" vacío
    userEvent.clear(screen.getByPlaceholderText("Ingrese el nombre de la categoría"));
    userEvent.type(screen.getByPlaceholderText("Ingrese descripción (opcional)"), "Descripción de la categoría");
  
    // Simula el clic en el botón de guardar
    userEvent.click(screen.getByRole('button', { name: /guardar/i }));
  
    // Verifica si el toast de error aparece (validación de nombre requerido)
    await waitFor(() => expect(screen.getByText(/El nombre de la categoría es obligatorio/i)).toBeInTheDocument());
  
    // Verifica que no se haya llamado a onCategorySaved
    expect(mockOnCategorySaved).not.toHaveBeenCalled();
  });
  
  it("Renderiza el formulario correctamente en modo creación", () => {
    render(
      <CategoryForm
        categoryId={null}
        initialData={null}
        onCategorySaved={mockOnCategorySaved}
        onCancel={mockOnCancel}
      />
    );
  
    // Verificar si el formulario está renderizado
    const saveButton = screen.getByRole('button', { name: /guardar/i });
    expect(saveButton).toBeInTheDocument();
  
    // Verificar si el campo de nombre está presente
    expect(screen.getByPlaceholderText(/ingrese el nombre de la categoría/i)).toBeInTheDocument();
  
    // Verificar si el campo de descripción está presente
    expect(screen.getByPlaceholderText(/ingrese descripción/i)).toBeInTheDocument();
  
    // Verificar si el dropdown tiene el valor visible correcto (Activo)
    const dropdown = screen.getByTestId('status-dropdown');
    
    // Comprobar que el texto visible sea "Activo"
    expect(dropdown).toHaveTextContent("Activo");
  });

  it("Renderiza el formulario correctamente en modo edición", () => {
    const initialData = {
      name: "Test Category",
      description: "Test Description",
      status: "ACTIVE",
    };

    render(
      <CategoryForm
        categoryId="123"
        initialData={initialData}
        onCategorySaved={mockOnCategorySaved}
        onCancel={mockOnCancel}
      />
    );

    // Verifica los valores iniciales de los inputs
    expect(screen.getByPlaceholderText("Ingrese el nombre de la categoría")).toHaveValue(
      "Test Category"
    );
    expect(screen.getByPlaceholderText("Ingrese descripción (opcional)")).toHaveValue(
      "Test Description"
    );

    // Busca el Dropdown usando `data-testid`
    const statusDropdown = screen.getByTestId("status-dropdown");
    expect(statusDropdown).toBeInTheDocument();
    expect(statusDropdown).toHaveTextContent("Activo"); // Verifica el texto visible
  });

  it("Muestra errores cuando faltan campos obligatorios", async () => {
    render(
      <CategoryForm
        categoryId={null}
        initialData={null}
        onCategorySaved={mockOnCategorySaved}
        onCancel={mockOnCancel}
      />
    );

    // Simula el envío del formulario sin completar el campo obligatorio
    fireEvent.click(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(screen.getByText("El nombre de la categoría es obligatorio.")).toBeInTheDocument();
    });
  });

  it("Llama a la función onCancel cuando se hace clic en cancelar", () => {
    render(
      <CategoryForm
        categoryId={null}
        initialData={null}
        onCategorySaved={mockOnCategorySaved}
        onCancel={mockOnCancel}
      />
    );

    // Simula el clic en el botón cancelar
    fireEvent.click(screen.getByText("Cancelar"));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("Muestra un mensaje de advertencia si el nombre de la categoría es duplicado", async () => {
    // Mock para simular una categoría existente
    CategoryService.prototype.getAllCategories.mockResolvedValueOnce([
      { nombre: "Duplicate Category", id: "1" },
    ]);
  
    render(
      <CategoryForm
        categoryId={null}
        initialData={null}
        onCategorySaved={mockOnCategorySaved}
        onCancel={mockOnCancel}
      />
    );
  
    // Simula el ingreso de un nombre duplicado
    const nameInput = screen.getByPlaceholderText("Ingrese el nombre de la categoría");
    userEvent.type(nameInput, "Duplicate Category");
  
    // Espera que el Toast muestre el mensaje de duplicado
    await waitFor(() => {
      // Usamos findByText dentro de waitFor para esperar el mensaje
      expect(screen.findByText("Ya existe una categoría con ese nombre.")).resolves.toBeInTheDocument();
    });
  });
  
  it("Llama a la función onCategorySaved al guardar correctamente en modo creación", async () => {
    CategoryService.prototype.createCategory = jest.fn().mockResolvedValue({
      nombre: "New Category",
      descripcion: "Test Description",
      estado: "ACTIVE",
    });

    render(
      <CategoryForm
        categoryId={null}
        initialData={null}
        onCategorySaved={mockOnCategorySaved}
        onCancel={mockOnCancel}
      />
    );

    // Completa el formulario
    fireEvent.change(screen.getByPlaceholderText("Ingrese el nombre de la categoría"), {
      target: { value: "New Category" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingrese descripción (opcional)"), {
      target: { value: "Test Description" },
    });

    fireEvent.click(screen.getByText("Guardar"));

    // Verifica que se llame al servicio de creación
    await waitFor(() => {
      expect(CategoryService.prototype.createCategory).toHaveBeenCalledWith({
        nombre: "New Category",
        descripcion: "Test Description",
        estado: "ACTIVE",
      });
    });

    // Verifica que se llame a la función onCategorySaved
    await waitFor(() => {
      expect(mockOnCategorySaved).toHaveBeenCalled();
    });
  }); 
  
  
});
