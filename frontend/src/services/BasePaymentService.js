// services/BasePaymentService.js
import { api } from "../components/config/Api";

export class BasePaymentService {
  /**
   * Create payment session for any payment method
   * @param {Object} orderData - Order information
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Payment response
   */
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

  /**
   * Verify payment status for any payment method
   * @param {string} sessionId - Payment session ID
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Verification result
   */
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

  
  /**
   * Redirect to payment page (works for both Stripe and VNPay)
   * @param {string} paymentUrl - Payment URL
   */
  static redirectToPayment(paymentUrl) {
    if (!paymentUrl) {
      throw new Error('Payment URL is required');
    }
    
    // Store current page for potential return
    try {
      localStorage.setItem('pre_payment_url', window.location.href);
    } catch (e) {
      // Handle localStorage not available
      console.warn('Could not store pre-payment URL');
    }
    
    window.location.href = paymentUrl;
  }

  /**
   * Extract session ID from URL (works for both payment methods)
   * @returns {string|null} Session ID
   */
  static extractSessionIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('session_id') || window.location.pathname.split('/').pop();
  }

  /**
   * Get payment status from URL path
   * @returns {string|null} Payment status
   */
  static getPaymentStatusFromUrl() {
    const path = window.location.pathname;
    if (path.includes('/payment/success')) return 'success';
    if (path.includes('/payment/cancel') || path.includes('/payment/failed')) return 'cancelled';
    return null;
  }
}