import React from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategorySearch from "../../../domain/products/infraestructure/components/category_components/CategorySearch";
import CategoryService from "../../../domain/products/domain/services/CategoryService";

jest.mock("../../../domain/products/domain/services/CategoryService");
jest.mock("primereact/toast", () => ({
  Toast: jest.fn(() => null), // Devuelve null para simplificar el renderizado
}));

jest.mock("../../../domain/products/domain/services/CategoryService", () => {
  return jest.fn().mockImplementation(() => ({
    getCategoryByName: jest.fn(),
    getCategoryByStatus: jest.fn(),
  }));
});


describe("CategorySearch", () => {
  const mockOnSearchResults = jest.fn();
  const mockOnClearTable = jest.fn();
  const categoryServiceMock = {
    getCategoryByName: jest.fn(),
    getCategoryByStatus: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    CategoryService.mockImplementation(() => categoryServiceMock);
  });

  it("Renderiza el formulario correctamente", () => {
    render(
      <CategorySearch
        onSearchResults={mockOnSearchResults}
        onClearTable={mockOnClearTable}
      />
    );

    // Verifica si el dropdown está presente
    expect(screen.getByTestId("search-type-dropdown")).toBeInTheDocument();

    // Verifica los botones
    expect(screen.getByRole("button", { name: /buscar/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /limpiar/i })).toBeEnabled();
  });

  it("Muestra el input correcto cuando se selecciona el tipo de búsqueda", async () => {
    render(
      <CategorySearch
        onSearchResults={mockOnSearchResults}
        onClearTable={mockOnClearTable}
      />
    );

    // Selecciona "Nombre"
    await userEvent.click(screen.getByTestId("search-type-dropdown"));
    await userEvent.click(screen.getByText("Nombre"));
    expect(screen.getByPlaceholderText("Buscar por Nombre")).toBeInTheDocument();

    // Selecciona "Estado"
    await userEvent.click(screen.getByTestId("search-type-dropdown"));
    await userEvent.click(screen.getByText("Estado"));

    // Verifica que el Dropdown de "Estado" esté presente
    expect(
      screen.getByRole("button", { name: /Seleccione Estado/i })
    ).toBeInTheDocument();
  });

  it("Realiza la búsqueda por nombre correctamente", async () => {
    categoryServiceMock.getCategoryByName.mockResolvedValue({
      content: [{ id: "1", nombre: "Test Category" }],
    });

    render(
      <CategorySearch
        onSearchResults={mockOnSearchResults}
        onClearTable={mockOnClearTable}
      />
    );

    // Selecciona "Nombre"
    await userEvent.click(screen.getByTestId("search-type-dropdown"));
    await userEvent.click(screen.getByText("Nombre"));

    // Ingresa un nombre y busca
    await userEvent.type(screen.getByPlaceholderText("Buscar por Nombre"), "Test");
    await userEvent.click(screen.getByRole("button", { name: /buscar/i }));

    await waitFor(() => {
      expect(categoryServiceMock.getCategoryByName).toHaveBeenCalledWith("Test");
      expect(mockOnSearchResults).toHaveBeenCalledWith([
        { id: "1", nombre: "Test Category" },
      ]);
    });
  });

  it("Realiza la búsqueda por estado correctamente", async () => {
    // Mock de la respuesta de la búsqueda por estado
    categoryServiceMock.getCategoryByStatus.mockResolvedValue({
      content: [{ id: "1", nombre: "Test Category", estado: "Activo" }],
    });

    render(
      <CategorySearch
        onSearchResults={mockOnSearchResults}
        onClearTable={mockOnClearTable}
      />
    );

    // Paso 1: Abre el primer dropdown (Tipo de búsqueda)
    const searchTypeDropdown = screen.getByTestId("search-type-dropdown");
    await userEvent.click(searchTypeDropdown);

    // Paso 2: Selecciona "Estado" en el primer dropdown
    const estadoOption = await screen.findByText("Estado");
    await userEvent.click(estadoOption);

    // Paso 3: Asegúrate de que el segundo Dropdown esté en el DOM
    const statusDropdown = await screen.findByTestId("status-dropdown"); // Espera a que aparezca
    expect(statusDropdown).toBeInTheDocument();

    // Paso 4: Abre el segundo Dropdown (Estado)
    await userEvent.click(statusDropdown);

    // Paso 5: Selecciona "Activo" en el menú flotante
    const activeOption = await screen.findByText("Activo");
    await userEvent.click(activeOption);

    // Paso 6: Clic en el botón "Buscar"
    const searchButton = screen.getByRole("button", { name: /buscar/i });
    await userEvent.click(searchButton);

    // Verificación: Asegura que se llama al servicio con el estado "ACTIVE"
    await waitFor(() => {
      expect(categoryServiceMock.getCategoryByStatus).toHaveBeenCalledWith("ACTIVE");
      expect(mockOnSearchResults).toHaveBeenCalledWith([
        { id: "1", nombre: "Test Category", estado: "Activo" },
      ]);
    });
  });

  

});