// services/products/CategoryService.js
import config from '../../config';
import ApiCategory from './apiCategory';

const API_CATEGORIES = config.API_CATEGORIES;

const CategoryService = {
    listCategories: () =>
        ApiCategory(`${API_CATEGORIES}/list`),

    saveCategory: (category) =>
        ApiCategory(`${API_CATEGORIES}/save`, 'POST', category),

    updateCategory: (id, updatedCategory) =>
        ApiCategory(`${API_CATEGORIES}/update/${id}`, 'PUT', updatedCategory),

    deleteCategory: (id) =>
        ApiCategory(`${API_CATEGORIES}/delete/${id}`, 'DELETE'),

    findCategoryById: (id) =>
        ApiCategory(`${API_CATEGORIES}/${id}`),
};

export default CategoryService;
