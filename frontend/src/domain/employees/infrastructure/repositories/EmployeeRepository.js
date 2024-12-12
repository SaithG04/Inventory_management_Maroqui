import { UsersHttp } from "../../../../utils/ConHttp"; // Asegúrate de que la ruta sea correcta

class UserRepository {
  // Obtener todos los usuarios
  async getAll(page = 0, size = 15) {
    const response = await UsersHttp.get(/*`?page=${page}&size=${size}`*/);
    return response;
  }

  // Registrar un nuevo usuario
  async create(user) {
    const response = await UsersHttp.post("/register", user);
    return response;
  }

  // Actualizar un usuario específico
  async update(id, user) {
    const response = await UsersHttp.put(`/update/${id}`, user);
    return response;
  }

  // Eliminar un usuario
  async delete(id) {
    const response = await UsersHttp.delete(`/delete/${id}`);
    return response;
  }

  // Asignar un rol a un usuario
  async assignRole(id, roleName) {
    const response = await UsersHttp.put(`/assign-role/${id}?roleName=${roleName}`);
    return response;
  }

  // Obtener todos los roles disponibles
  async getAllRoles() {
    const response = await UsersHttp.get("/roles");
    return response;
  }

  // Obtener el perfil del usuario autenticado
  async getProfile(token) {
    const response = await UsersHttp.get("/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }

  // Activar o desactivar un usuario
  async updateStatus(id, status) {
    const response = await UsersHttp.put(`/activate/${id}`, { status });
    return response;
  }
}

export default UserRepository;
