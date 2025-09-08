package com.leanhduc.fooddelivery.Service.Payment;

import com.leanhduc.fooddelivery.Model.Order;
import com.leanhduc.fooddelivery.Response.PaymentResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface IPaymentService {
    PaymentResponse createPaymentLink(Order order, HttpServletRequest request) throws Exception;

    void handleWebhook(String payload, String sigHeader);

    boolean verifyPaymentStatus(String sessionId);
}
