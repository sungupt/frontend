import apiClient from './apiClient';

const PAYMENT_API_BASE = '/payment-api';

export const paymentService = {
  // Add new card
  addCard: async (cardData: {
    cardType: string;
    cardNumber: string;
    nameOnCard: string;
    cvv: number;
    expiryDate: string;
  }) => {
    return apiClient.post(`${PAYMENT_API_BASE}/cards`, cardData);
  },

  // Get all customer cards
  getAllCards: async () => {
    return apiClient.get(`${PAYMENT_API_BASE}/cards`);
  },

  // Get cards by type (CREDIT or DEBIT)
  getCardsByType: async (cardType: string) => {
    return apiClient.get(`${PAYMENT_API_BASE}/cards/${cardType}`);
  },

  // Get credit cards only
  getCreditCards: async () => {
    return apiClient.get(`${PAYMENT_API_BASE}/cards/CREDIT`);
  },

  // Get debit cards only
  getDebitCards: async () => {
    return apiClient.get(`${PAYMENT_API_BASE}/cards/DEBIT`);
  },

  // Validate card details
  validateCard: async (cardData: {
    cardType: string;
    cardNumber: string;
    nameOnCard: string;
    cvv: number;
    expiryDate: string;
  }) => {
    // Client-side validation
    const errors: string[] = [];

    if (!['CREDIT', 'DEBIT'].includes(cardData.cardType)) {
      errors.push('Invalid card type');
    }

    if (!/^\d{16}$/.test(cardData.cardNumber)) {
      errors.push('Card number must be 16 digits');
    }

    if (!/^\d{3}$/.test(String(cardData.cvv))) {
      errors.push('CVV must be 3 digits');
    }

    const expiryDate = new Date(cardData.expiryDate);
    if (expiryDate <= new Date()) {
      errors.push('Expiry date must be in the future');
    }

    if (!/^[a-zA-Z\s]+$/.test(cardData.nameOnCard)) {
      errors.push('Name on card should contain only alphabets and spaces');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default paymentService;
