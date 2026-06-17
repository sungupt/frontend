import apiClient from './apiClient';

const PRODUCT_API_BASE = '/product-api';

export const productService = {
  // Get all products with pagination and filters
  getAllProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    search?: string;
  }) => {
    return apiClient.get(`${PRODUCT_API_BASE}/products`, { params });
  },

  // Get product by ID
  getProductById: async (productId: number) => {
    return apiClient.get(`${PRODUCT_API_BASE}/product/${productId}`);
  },

  // Search products
  searchProducts: async (params: {
    query: string;
    page?: number;
    limit?: number;
  }) => {
    return apiClient.get(`${PRODUCT_API_BASE}/search`, { params });
  },

  // Get all categories
  getCategories: async () => {
    return apiClient.get(`${PRODUCT_API_BASE}/categories`);
  },

  // Get all brands
  getBrands: async () => {
    return apiClient.get(`${PRODUCT_API_BASE}/brands`);
  },

  // Filter products by category
  getByCategory: async (category: string, page?: number, limit?: number) => {
    return apiClient.get(`${PRODUCT_API_BASE}/products`, {
      params: { category, page, limit }
    });
  },

  // Filter products by brand
  getByBrand: async (brand: string, page?: number, limit?: number) => {
    return apiClient.get(`${PRODUCT_API_BASE}/products`, {
      params: { brand, page, limit }
    });
  }
};

export default productService;
