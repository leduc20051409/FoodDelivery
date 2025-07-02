package com.leanhduc.fooddelivery.Service.Payment;

import com.leanhduc.fooddelivery.Model.Order;
import com.leanhduc.fooddelivery.Response.PaymentResponse;
import com.stripe.exception.StripeException;

public interface IPaymentService {
    PaymentResponse createPaymentLink(Order order) throws StripeException;
}
