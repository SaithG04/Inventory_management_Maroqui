class ProductService {
    async searchByName(query) {
        if (query === "ValidName") {
            return Promise.resolve([
                { id: "1", name: "ValidName", state: "ACTIVE" },
                { id: "2", name: "ValidName2", state: "INACTIVE" },
            ]);
        }
        return Promise.resolve([]);
    }

    async searchByStatus(status) {
        if (status === "ACTIVE") {
            return Promise.resolve([
                { id: "1", name: "Active Product 1", state: "ACTIVE" },
                { id: "2", name: "Active Product 2", state: "ACTIVE" },
            ]);
        } else if (status === "INACTIVE") {
            return Promise.resolve([
                { id: "3", name: "Inactive Product 1", state: "INACTIVE" },
                { id: "4", name: "Inactive Product 2", state: "INACTIVE" },
            ]);
        }
        return Promise.resolve([]);
    }

    async searchByCategory(category) {
        // Simula búsqueda por "Categoría 1", "Categoría 2", etc.
        if (category === "Categoría 1") {
            return Promise.resolve([
                { id: "5", name: "Producto 1", category: "Categoría 1", state: "ACTIVE" },
                { id: "6", name: "Producto 2", category: "Categoría 1", state: "INACTIVE" },
            ]);
        } else if (category === "Categoría 2") {
            return Promise.resolve([
                { id: "7", name: "Producto 3", category: "Categoría 2", state: "ACTIVE" },
                { id: "8", name: "Producto 4", category: "Categoría 2", state: "ACTIVE" },
            ]);
        }
        return Promise.resolve([]);
    }
}

export default ProductService;
