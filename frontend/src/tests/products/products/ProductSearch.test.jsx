import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductSearch from "../../../domain/products/infraestructure/components/product_components/ProductSearch";
import ProductService from "../../../domain/products/domain/services/ProductService";
import CategoryService from "../../../domain/products/domain/services/CategoryService";

// Mocks de servicios
jest.mock("../../../domain/products/domain/services/ProductService", () => {
    return jest.fn().mockImplementation(() => ({
        searchByName: jest.fn(),
        searchByStatus: jest.fn(),
        searchByCategory: jest.fn(),
    }));
});

jest.mock("../../../domain/products/domain/services/CategoryService", () => {
    return jest.fn().mockImplementation(() => ({
        getAllCategories: jest.fn(),
    }));
});

describe("Componente ProductSearch", () => {
    let mockOnSearchResults;
    let mockOnClearTable;
    let mockProductService;
    let mockCategoryService;

    beforeEach(() => {
        mockOnSearchResults = jest.fn();
        mockOnClearTable = jest.fn();

        // Simular instancias de servicios
        mockProductService = {
            searchByName: jest.fn(() =>
                Promise.resolve([
                    { id: "1", name: "Producto 1", state: "ACTIVE" },
                    { id: "2", name: "Producto 2", state: "INACTIVE" },
                ])
            ),
            searchByStatus: jest.fn(() =>
                Promise.resolve([{ id: "1", name: "Producto Estado 1", state: "ACTIVE" }])
            ),
            searchByCategory: jest.fn(() =>
                Promise.resolve([
                    { id: "1", name: "Producto Categoría", category: "Categoría 2" },
                ])
            ),
        };

        mockCategoryService = {
            getAllCategories: jest.fn(() =>
                Promise.resolve([
                    { nombre: "Categoría 1" },
                    { nombre: "Categoría 2" },
                    { nombre: "Categoría 3" },
                ])
            ),
        };

        // Configurar los mocks
        ProductService.mockImplementation(() => mockProductService);
        CategoryService.mockImplementation(() => mockCategoryService);
    });

    it("realiza búsqueda por estado correctamente", async () => {
        render(<ProductSearch onSearchResults={mockOnSearchResults} onClearTable={mockOnClearTable} />);

        // Seleccionar búsqueda por estado
        fireEvent.click(screen.getByTestId("search-type-dropdown"));
        fireEvent.click(screen.getByText("Estado"));

        // Seleccionar estado
        fireEvent.click(screen.getByTestId("status-dropdown"));
        fireEvent.click(screen.getByText("Activo"));

        // Hacer click en "Buscar"
        fireEvent.click(screen.getByText("Buscar"));

        // Verificar resultados
        await waitFor(() => {
            expect(mockOnSearchResults).toHaveBeenCalledWith([
                { id: "1", name: "Producto Estado 1", state: "ACTIVE" },
            ]);
        });
    });

    it("realiza búsqueda por categoría correctamente", async () => {
        render(<ProductSearch onSearchResults={mockOnSearchResults} onClearTable={mockOnClearTable} />);

        // Seleccionar búsqueda por categoría
        fireEvent.click(screen.getByTestId("search-type-dropdown"));
        fireEvent.click(screen.getByText("Categoría"));

        // Cargar categorías
        fireEvent.click(screen.getByTestId("category-dropdown"));
        const categoryOption = await screen.findByText("Categoría 2");
        fireEvent.click(categoryOption);

        // Hacer click en "Buscar"
        fireEvent.click(screen.getByText("Buscar"));

        // Verificar resultados
        await waitFor(() => {
            expect(mockOnSearchResults).toHaveBeenCalledWith([
                { id: "1", name: "Producto Categoría", category: "Categoría 2" },
            ]);
        });
    });

    it("realiza búsqueda por nombre correctamente", async () => {
        render(<ProductSearch onSearchResults={mockOnSearchResults} onClearTable={mockOnClearTable} />);

        // Seleccionar búsqueda por nombre
        fireEvent.click(screen.getByTestId("search-type-dropdown"));
        fireEvent.click(screen.getByText("Nombre"));

        // Ingresar nombre a buscar
        fireEvent.change(screen.getByPlaceholderText("Buscar por Nombre"), {
            target: { value: "Producto" },
        });

        // Hacer click en "Buscar"
        fireEvent.click(screen.getByText("Buscar"));

        // Verificar resultados
        await waitFor(() => {
            expect(mockOnSearchResults).toHaveBeenCalledWith([
                { id: "1", name: "Producto 1", state: "ACTIVE" },
                { id: "2", name: "Producto 2", state: "INACTIVE" },
            ]);
        });
    });

    it("limpia la búsqueda correctamente", async () => {
        render(<ProductSearch onSearchResults={mockOnSearchResults} onClearTable={mockOnClearTable} />);

        // Seleccionar búsqueda por nombre
        fireEvent.click(screen.getByTestId("search-type-dropdown"));
        fireEvent.click(screen.getByText("Nombre"));

        // Ingresar un nombre
        fireEvent.change(screen.getByPlaceholderText("Buscar por Nombre"), { target: { value: "Producto 1" } });

        // Hacer clic en "Limpiar"
        fireEvent.click(screen.getByText("Limpiar"));

        // Verificar que el campo se limpió y la tabla se restableció
        expect(screen.getByPlaceholderText("Buscar por Nombre").value).toBe("");
        expect(mockOnClearTable).toHaveBeenCalled();
    });

    it("muestra mensaje de error si la búsqueda falla", async () => {
        // Configurar el mock para que falle
        mockProductService.searchByName.mockImplementation(() => Promise.reject(new Error("Error en el servicio")));

        render(<ProductSearch onSearchResults={mockOnSearchResults} onClearTable={mockOnClearTable} />);

        // Seleccionar búsqueda por nombre
        fireEvent.click(screen.getByTestId("search-type-dropdown"));
        fireEvent.click(screen.getByText("Nombre"));

        // Ingresar un nombre
        fireEvent.change(screen.getByPlaceholderText("Buscar por Nombre"), { target: { value: "Producto 1" } });

        // Hacer clic en "Buscar"
        fireEvent.click(screen.getByText("Buscar"));

        // Verificar que se muestra el mensaje de error
        await waitFor(() => {
            expect(screen.getByText("Error de Búsqueda")).toBeInTheDocument();
        });
    });

    it("deshabilita el botón Buscar si los campos no están completos", () => {
        render(<ProductSearch onSearchResults={mockOnSearchResults} onClearTable={mockOnClearTable} />);

        // El botón debe estar deshabilitado inicialmente
        expect(screen.getByRole("button", { name: /Buscar/i })).toBeDisabled();

        // Seleccionar búsqueda por estado
        fireEvent.click(screen.getByTestId("search-type-dropdown"));
        fireEvent.click(screen.getByText("Estado"));

        // El botón sigue deshabilitado porque no se seleccionó un estado
        expect(screen.getByRole("button", { name: /Buscar/i })).toBeDisabled();

        // Seleccionar un estado
        fireEvent.click(screen.getByTestId("status-dropdown"));
        fireEvent.click(screen.getByText("Activo"));

        // Ahora el botón debe estar habilitado
        expect(screen.getByRole("button", { name: /Buscar/i })).not.toBeDisabled();
    });


});
