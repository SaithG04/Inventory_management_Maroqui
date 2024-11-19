export const getRolesFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificar JWT
      return decodedToken.roles || [];
    }
    return [];
  };
  