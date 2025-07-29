package com.leanhduc.fooddelivery.Service.Payment;

import com.leanhduc.fooddelivery.Model.Order;
import com.leanhduc.fooddelivery.Response.PaymentResponse;
import com.stripe.exception.StripeException;
import org.springframework.transaction.annotation.Transactional;

public interface IPaymentService {
    PaymentResponse createPaymentLink(Order order) throws StripeException;

    void handleWebhook(String payload, String sigHeader);

    boolean verifyPaymentStatus(String sessionId);
}
