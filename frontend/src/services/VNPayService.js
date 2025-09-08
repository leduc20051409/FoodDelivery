// services/VNPayService.js
import { BasePaymentService } from './BasePaymentService';

export class VNPayService extends BasePaymentService {
  /**
   * Create VNPay payment
   * @param {Object} orderData - Order information
   * @param {string} token - JWT token
   * @returns {Promise<Object>} VNPay payment response
   */
  static async createVNPayPayment(orderData, token) {
    const orderWithPaymentMethod = {
      ...orderData,
      paymentMethod: 'VN_PAY'
    };
    return await this.createPaymentSession(orderWithPaymentMethod, token);
  }

  /**
   * Process VNPay order (create and redirect)
   * @param {Object} orderData - Order information
   * @param {string} token - JWT token
   */
  static async processVNPayOrder(orderData, token) {
    try {
      const response = await this.createVNPayPayment(orderData, token);
      const paymentUrl = response.payment_url || response.paymentUrl;
      
      if (paymentUrl) {
        this.redirectToPayment(paymentUrl);
      } else {
        throw new Error('VNPay payment URL not received');
      }
    } catch (error) {
      console.error('VNPay order processing failed:', error);
      throw error;
    }
  }

  /**
   * Get order ID from VNPay return URL
   * @returns {string|null} Order ID
   */
  static getOrderIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('orderId');
  }

  /**
   * Get VNPay payment result from URL
   * @returns {Object} Payment result info
   */
  static getVNPayResult() {
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    
    return {
      isSuccess: path.includes('/payment/success'),
      isFailed: path.includes('/payment/failed'),
      orderId: urlParams.get('orderId'),
      message: urlParams.get('message')
    };
  }

  /**
   * Handle VNPay return with callbacks
   * @param {Function} onSuccess - Success callback
   * @param {Function} onFailure - Failure callback
   */
  static handleVNPayReturn(onSuccess, onFailure) {
    const result = this.getVNPayResult();
    
    if (result.isSuccess) {
      onSuccess && onSuccess(result);
    } else if (result.isFailed) {
      onFailure && onFailure(result);
    }
  }

  /**
   * Check VNPay payment status
   * @param {string} transactionId - VNPay transaction ID
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Payment status
   */
  static async checkVNPayStatus(transactionId, token) {
    return await this.checkPaymentStatus('VN_PAY', transactionId, token);
  }

  /**
   * Poll VNPay payment status until completion
   * @param {string} transactionId - Transaction ID
   * @param {string} token - JWT token
   * @param {Object} options - Polling options
   * @returns {Promise<Object>} Final payment status
   */
  static async pollVNPayStatus(transactionId, token, options = {}) {
    const { 
      maxAttempts = 10, 
      interval = 3000, 
      onStatusUpdate 
    } = options;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const status = await this.checkVNPayStatus(transactionId, token);
        
        onStatusUpdate && onStatusUpdate(status, attempt);
        
        if (status.completed) {
          return status;
        }
        
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, interval));
        }
      } catch (error) {
        console.error(`VNPay status check attempt ${attempt} failed:`, error);
        
        if (attempt === maxAttempts) {
          throw error;
        }
      }
    }
    
    throw new Error('VNPay payment status polling timeout');
  }
}