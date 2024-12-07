class Provider {
    constructor({ id, name, contact, email, address, status }) {
      this.id = id || null;
      this.name = name || '';
      this.contact = contact || '';
      this.email = email || '';
      this.address = address || '';
      this.status = status || 'ACTIVE'; // ACTIVE, INACTIVE
    }
  
    // Método para validar que el teléfono tiene 9 dígitos
    isValidContact() {
      return this.contact && this.contact.length === 9;
    }
  
    // Método para validar que el email contiene '@'
    isValidEmail() {
      return this.email && this.email.includes('@');
    }
  
    // Método para validar si el proveedor está activo
    isActive() {
      return this.status === 'ACTIVE';
    }
  
    // Método para cambiar el estado a 'INACTIVE'
    setInactive() {
      this.status = 'INACTIVE';
    }
  }
  
  export default Provider;
  