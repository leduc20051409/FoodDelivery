// services/index.js
// Export all payment services for easy importing

export { BasePaymentService } from './BasePaymentService';
export { StripePaymentService } from './StripePaymentService';
export { VNPayService } from './VNPayService';
export { PaymentServiceFactory, PAYMENT_METHODS } from './PaymentServiceFactory';

// For backward compatibility with existing code
export { StripePaymentService as PaymentService } from './StripePaymentService';