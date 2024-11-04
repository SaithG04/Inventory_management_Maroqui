export const AuthPort = {
  loginUser: async (email, password) => {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const user = employees.find(emp => emp.email === email);

    if (!user) {
      return { success: false, message: 'Usuario no registrado.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Contraseña incorrecta.' };
    }

    return { success: true, role: user.role, fullName: user.fullName, message: 'Autenticación exitosa' };
  }
};
