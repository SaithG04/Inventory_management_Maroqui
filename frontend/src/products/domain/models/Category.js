class Category {
    constructor({ id, name, description, status }) {
      this.id = id || null;
      this.name = name || '';
      this.description = description || '';
      this.status = status || 'ACTIVE'; // ACTIVE, INACTIVE
    }
  
    activate() {
      this.status = 'ACTIVE';
    }
  
    deactivate() {
      this.status = 'INACTIVE';
    }
  }
  
  export default Category;
  