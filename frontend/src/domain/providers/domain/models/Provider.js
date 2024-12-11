class Provider {
    constructor({ id, name, contact, phone, email, address, state, conditions }) {
      this.id = id || null;
      this.name = name || '';
      this.contact = contact || '';
      this.phone = phone || '';
      this.email = email || '';
      this.address = address || '';
      this.state = state || 'ACTIVE'; // ACTIVE, INACTIVE
      this.conditions = conditions || '';
    }
  
    // Método para validar que el teléfono tiene 9 dígitos
    isValidPhone() {
      return this.phone && this.phone.length === 9;
    }
  
    // Método para validar que el email contiene '@'
    isValidEmail() {
      return this.email && this.email.includes('@');
    }
  
    // Método para validar que el nombre del contacto solo contenga letras y espacios
    isValidContactName() {
      return /^[A-Za-z\s]+$/.test(this.contact);
    }
  
    // Método para validar si el proveedor está activo
    isActive() {
      return this.state === 'ACTIVE';
    }
  
    // Método para cambiar el estado a 'INACTIVE'
    setInactive() {
      this.state = 'INACTIVE';
    }
  }
  
  export default Provider;
  