import apiClient from './apiClient';

const ORDER_API_BASE = '/order-api';

export const orderService = {
  // Place new order
  placeOrder: async (orderData: {
    dateOfDelivery: string;
    paymentCardId: number;
  }) => {
    return apiClient.post(`${ORDER_API_BASE}/place-order`, orderData);
  },

  // Get all customer orders
  getCustomerOrders: async () => {
    return apiClient.get(`${ORDER_API_BASE}/orders`);
  },

  // Get order details by ID
  getOrderDetails: async (orderId: number) => {
    return apiClient.get(`${ORDER_API_BASE}/order/${orderId}`);
  },

  // Get order status
  getOrderStatus: async (orderId: number) => {
    const response = await apiClient.get(`${ORDER_API_BASE}/order/${orderId}`);
    if (response.data?.status === 'success') {
      return response.data?.data?.order_status || 'UNKNOWN';
    }
    return 'ERROR';
  },

  // Cancel order (optional - if backend supports)
  cancelOrder: async (orderId: number) => {
    try {
      return await apiClient.put(`${ORDER_API_BASE}/order/${orderId}/cancel`);
    } catch (error) {
      console.log('Cancel order not implemented in backend');
      return null;
    }
  }
};

export default orderService;
