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

    findByName: (name, page = 0, size = 15) =>
        ApiCategory(`${API_CATEGORIES}/findByName?name=${name}&page=${page}&size=${size}`),

    findByStatus: (status, page = 0, size = 15) =>
        ApiCategory(`${API_CATEGORIES}/findByStatus?status=${status}&page=${page}&size=${size}`),

};

export default CategoryService;
