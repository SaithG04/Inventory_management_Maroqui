import { UsersHttp } from "../../../../utils/ConHttp"; // Asegúrate de que la ruta sea correcta

class UserRepository {


  // Obtener usuarios por correo electrónico
  async findByEmail(email) {
    try {
      const response = await UsersHttp.get(`findByEmail?email=${email}`);
      // Verificar la respuesta completa
      console.log('Respuesta de findByEmail:', response);
      return response.data.data;  // Suponiendo que la respuesta está en response.data.data
    } catch (error) {
      console.error('Error al obtener empleados por email:', error);
      throw error;
    }
  }


  // Obtener todos los usuarios
  async getAll(page = 0, size = 15) {
    const response = await UsersHttp.get(); // Realiza la solicitud GET
    return response.data.data; // Extrae la lista de usuarios dentro de 'data'
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
    return response.data; // Ajusta según la respuesta de tu API
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
