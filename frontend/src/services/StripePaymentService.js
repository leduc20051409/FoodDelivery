// services/StripePaymentService.js
import { BasePaymentService } from './BasePaymentService';

export class StripePaymentService extends BasePaymentService {
  /**
   * Create Stripe payment
   * @param {Object} orderData - Order information
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Stripe payment response
   */
  static async createStripePayment(orderData, token) {
    const orderWithPaymentMethod = {
      ...orderData,
      paymentMethod: 'STRIPE_PAY'
    };
    return await this.createPaymentSession(orderWithPaymentMethod, token);
  }

  /**
   * Process Stripe order (create and redirect)
   * @param {Object} orderData - Order information
   * @param {string} token - JWT token
   */
  static async processStripeOrder(orderData, token) {
    try {
      const response = await this.createStripePayment(orderData, token);
      const paymentUrl = response.payment_url || response.payment_link_url || response.paymentUrl;
      
      if (paymentUrl) {
        this.redirectToPayment(paymentUrl);
      } else {
        throw new Error('Stripe payment URL not received');
      }
    } catch (error) {
      console.error('Stripe order processing failed:', error);
      throw error;
    }
  }

  /**
   * Get Stripe session ID from URL
   * @returns {string|null} Stripe session ID
   */
  static getStripeSessionId() {
    return this.extractSessionIdFromUrl();
  }


}