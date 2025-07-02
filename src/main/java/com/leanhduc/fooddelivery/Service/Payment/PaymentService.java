package com.leanhduc.fooddelivery.Service.Payment;

import com.leanhduc.fooddelivery.Model.Order;
import com.leanhduc.fooddelivery.Response.PaymentResponse;
import com.stripe.Stripe;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService implements IPaymentService{

    @Value("${stripe.api.key}")
    private String stripSecretKey;

    @Override
    public PaymentResponse createPaymentLink(Order order) throws StripeException {
        Stripe.apiKey = stripSecretKey;
        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:5173/payment/success" + order.getId())
                .setCancelUrl("http://localhost:5173/payment/cancel" + order.getId())
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("usd")
                                .setUnitAmount((long) order.getTotalPrice() * 100)
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName("Duc Food Delivery")
                                        .build())
                                .build()
                        )
                        .build()
                ).build();
        Session session = Session.create(params);
        PaymentResponse response = new PaymentResponse();
        response.setPayment_url(session.getUrl());
        return response;
    }
}
