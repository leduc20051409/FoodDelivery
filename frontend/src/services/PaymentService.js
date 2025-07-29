// services/PaymentService.js
import { api } from "../components/config/Api";

export class PaymentService {
  static async createPaymentSession(orderData, token) {
    try {
      const response = await api.post('/api/orders/order', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      return response.data;
    } catch (error) {
      console.error('Payment session creation failed:', error);
      throw new Error(error.response?.data?.message || 'Payment session creation failed');
    }
  }

  static async verifyPayment(sessionId, token) {
    try {
      const response = await api.get(`/api/webhooks/verify-payment/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  }

  static redirectToPayment(paymentUrl) {
    if (!paymentUrl) {
      throw new Error('Payment URL is required');
    }
    window.location.href = paymentUrl;
  }

  static extractSessionIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('session_id') || window.location.pathname.split('/').pop();
  }

  static getPaymentStatusFromUrl() {
    const path = window.location.pathname;
    if (path.includes('/payment/success')) return 'success';
    if (path.includes('/payment/cancel')) return 'cancelled';
    return null;
  }
}