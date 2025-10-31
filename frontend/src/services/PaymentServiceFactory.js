// services/PaymentServiceFactory.js
import { StripePaymentService } from './StripePaymentService';
import { VNPayService } from './VNPayService';

export class PaymentServiceFactory {
  /**
   * Get appropriate payment service based on payment method
   * @param {string} paymentMethod - Payment method ('STRIPE_PAY', 'VN_PAY')
   * @returns {Object} Payment service class
   */
  static getPaymentService(paymentMethod) {
    switch (paymentMethod) {
      case 'STRIPE_PAY':
        return StripePaymentService;
      case 'VN_PAY':
        return VNPayService;
      default:
        throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }
  }

  /**
   * Create payment for any method
   * @param {string} paymentMethod - Payment method
   * @param {Object} orderData - Order data
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Payment response
   */
  static async createPayment(paymentMethod, orderData, token) {
    const service = this.getPaymentService(paymentMethod);
    
    if (paymentMethod === 'STRIPE_PAY') {
      return await service.processStripeOrder(orderData, token);
    } else if (paymentMethod === 'VN_PAY') {
      return await service.processVNPayOrder(orderData, token);
    }
  }

  /**
   * Verify payment for any method
   * @param {string} paymentMethod - Payment method
   * @param {string} sessionId - Session ID
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Verification result
   */
  static async verifyPayment(paymentMethod, sessionId, token) {
    const service = this.getPaymentService(paymentMethod);
    return await service.verifyPayment(sessionId, token);
  }


}

// Export supported payment methods
export const PAYMENT_METHODS = {
  STRIPE: 'STRIPE_PAY',
  VNPAY: 'VN_PAY',
  COD: 'CASH_ON_DELIVERY'
};