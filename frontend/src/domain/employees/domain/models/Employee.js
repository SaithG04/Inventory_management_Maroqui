class Employee {
    constructor({
        id,
        firstName,
        lastName,
        email,
        password,
        age,
        birthDate,
        address,
        phone,
        sex,
        maritalStatus,
        status,
    }) {
        this.id = id || null;
        this.firstName = firstName || '';
        this.lastName = lastName || '';
        this.email = email || '';
        this.password = password || ''; // No se mostrará en el frontend
        this.age = age || null;
        this.birthDate = birthDate || '';
        this.address = address || '';
        this.phone = phone || '';
        this.sex = sex || '';
        this.maritalStatus = maritalStatus || '';
        this.status = status || 'ACTIVE'; // ACTIVE, INACTIVE
    }

    // Método para validar que el teléfono tiene 9 dígitos
    isValidPhone() {
        return this.phone && this.phone.length === 9;
    }

    // Método para validar que el email contiene '@'
    isValidEmail() {
        return this.email && this.email.includes('@');
    }

    // Método para validar si el empleado está activo
    isActive() {
        return this.status === 'ACTIVE';
    }

    // Método para cambiar el estado a 'INACTIVE'
    setInactive() {
        this.status = 'INACTIVE';
    }

    // Método para cambiar el estado a 'ACTIVE'
    setActive() {
        this.status = 'ACTIVE';
    }

    // Método para obtener el nombre completo del empleado
    getFullName() {
        return `${this.firstName} ${this.lastName}`.trim();
    }
}

export default Employee;
