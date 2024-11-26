// services/products/ProductService.js
import config from '../../config';
import ApiProduct from './apiProduct';

const API_PRODUCTS = config.API_PRODUCTS;

const ProductService = {
    listProducts: (page = 0, size = 15) =>
        ApiProduct(`${API_PRODUCTS}/listProducts?page=${page}&size=${size}`),

    saveProduct: (product) =>
        ApiProduct(`${API_PRODUCTS}/saveProduct`, 'POST', product),

    updateProduct: (id, product) =>
        ApiProduct(`${API_PRODUCTS}/updateProduct/${id}`, 'PUT', product),

    deleteProduct: (id) =>
        ApiProduct(`${API_PRODUCTS}/deleteProduct/${id}`, 'DELETE'),

    findProductById: (id) =>
        ApiProduct(`${API_PRODUCTS}/findProductById/${id}`),

    findByStatus: (status, page = 0, size = 15) =>
        ApiProduct(`${API_PRODUCTS}/findByStatus?status=${status}&page=${page}&size=${size}`),

    findByCategoryName: (categoryName, page = 0, size = 15) =>
        ApiProduct(`${API_PRODUCTS}/findByCategoryName?categoryName=${categoryName}&page=${page}&size=${size}`),

    findByName: (name, page = 0, size = 15) =>
        ApiProduct(`${API_PRODUCTS}/findByName?name=${name}&page=${page}&size=${size}`),
};

export default ProductService;
