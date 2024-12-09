class Category {
  constructor({ id, name, description, status }) {
    this.id = id || null;
    this.name = name || '';
    this.description = description || '';
    this.status = status || 'ACTIVE'; // ACTIVE, INACTIVE
  }

  validateName() {
    const nameRegex = /^[a-zA-Z\s]+$/; // Solo letras y espacios
    if (!nameRegex.test(this.name)) {
      throw new Error('Name must only contain letters and spaces.');
    }
  }

  validateStatus() {
    const validStatuses = ['ACTIVE', 'INACTIVE'];
    if (!validStatuses.includes(this.status)) {
      throw new Error('Status must be either ACTIVE or INACTIVE.');
    }
  }

  validate() {
    this.validateName();
    this.validateStatus();
  }
}

export default Category;