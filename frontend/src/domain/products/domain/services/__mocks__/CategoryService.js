class CategoryService {
  async getAllCategories() {
      // Simula respuesta con "Categoría 1", "Categoría 2", etc.
      return Promise.resolve([
          { nombre: "Categoría 1" },
          { nombre: "Categoría 2" },
          { nombre: "Categoría 3" },
          { nombre: "Categoría 4" },
      ]);
  }
}

export default CategoryService;
