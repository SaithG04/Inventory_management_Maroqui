class ProviderService {
    async getProviderById(providerId) {
        if (providerId === "valid-id") {
            return {
                data: {
                    name: "Test Provider",
                    contact: "John Doe",
                    phone: "123456789",
                    email: "test@example.com",
                    address: "123 Test St",
                    state: "ACTIVE",
                    conditions: "Test Conditions",
                },
            };
        } else {
            return { data: null };
        }
    }

    async createProvider(providerData) {
        return { data: { id: "new-id", ...providerData } };
    }

    async updateProvider(providerId, providerData) {
        return { data: { id: providerId, ...providerData } };
    }

    async findByName(query, page, size) {
        if (query === "ValidName") {
            return [
                { id: "1", name: "ValidName", state: "ACTIVE" },
                { id: "2", name: "ValidName2", state: "INACTIVE" },
            ];
        }
        return [];
    }

    async findByStatus(status, page, size) {
        if (status === "ACTIVE") {
          return [
            { id: "1", name: "Active Provider 1", state: "ACTIVE" },
            { id: "2", name: "Active Provider 2", state: "ACTIVE" },
          ];
        } else if (status === "INACTIVE") {
          return [
            { id: "3", name: "Inactive Provider 1", state: "INACTIVE" },
            { id: "4", name: "Inactive Provider 2", state: "INACTIVE" },
          ];
        }
        return [];
      }
      
}

export default ProviderService;
