import apiClient from './apiClient';

const CART_API_BASE = '/cart-api';

export const cartService = {
  // Add product to cart
  addProductToCart: async (productId: number, quantity: number) => {
    return apiClient.post(`${CART_API_BASE}/products`, {
      productId,
      quantity
    });
  },

  // Get cart products
  getCartProducts: async () => {
    return apiClient.get(`${CART_API_BASE}/products`);
  },

  // Update product quantity in cart
  updateProductQuantity: async (productId: number, quantity: number) => {
    return apiClient.put(`${CART_API_BASE}/product/${productId}`, { quantity });
  },

  // Remove product from cart
  removeProductFromCart: async (productId: number) => {
    return apiClient.delete(`${CART_API_BASE}/product/${productId}`);
  },

  // Clear entire cart
  clearCart: async () => {
    return apiClient.delete(`${CART_API_BASE}/clear`);
  },

  // Get cart total price
  getCartTotal: async () => {
    const response = await apiClient.get(`${CART_API_BASE}/products`);
    if (response.data?.status === 'success' && response.data?.data) {
      return response.data.data.reduce((total: number, item: any) => {
        return total + (item.price * item.quantity);
      }, 0);
    }
    return 0;
  },

  // Get cart item count
  getCartItemCount: async () => {
    const response = await apiClient.get(`${CART_API_BASE}/products`);
    if (response.data?.status === 'success' && response.data?.data) {
      return response.data.data.length;
    }
    return 0;
  }
};

export default cartService;
