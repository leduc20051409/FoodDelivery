package com.leanhduc.fooddelivery.Service.Payment;

import com.leanhduc.fooddelivery.Exception.InvalidParamException;
import com.leanhduc.fooddelivery.Model.Order;
import com.leanhduc.fooddelivery.Model.OrderStatus;
import com.leanhduc.fooddelivery.Model.PaymentStatus;
import com.leanhduc.fooddelivery.Repository.OrderRepository;
import com.leanhduc.fooddelivery.Response.PaymentResponse;
import com.leanhduc.fooddelivery.Service.Order.IOrderService;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService implements IPaymentService {

    @Value ("${stripe.api.key}")
    private String stripeSecretKey;

    @Value ("${stripe.webhook.secret}")
    private String webhookSecret;

    @Value ("${app.frontend.url}")
    private String frontendUrl;

    private final OrderRepository orderRepository;
    private final IOrderService orderService;


    @Override
    public PaymentResponse createPaymentLink(Order order) throws StripeException {
        if (order == null || order.getId() == null) {
            throw new InvalidParamException("Invalid order provided");
        }

        if (order.getTotalPrice() == null || order.getTotalPrice() <= 0) {
            throw new InvalidParamException("Invalid order total amount");
        }

        Stripe.apiKey = stripeSecretKey;

        Map<String, String> metadata = new HashMap<>();
        metadata.put("order_id", order.getId().toString());
        metadata.put("customer_id", order.getCustomer().getId().toString());
        metadata.put("created_at", String.valueOf(System.currentTimeMillis()));

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendUrl + "/payment/success/{CHECKOUT_SESSION_ID}")
                .setCancelUrl(frontendUrl + "/payment/cancel/{CHECKOUT_SESSION_ID}")
                .putAllMetadata(metadata)
                .setExpiresAt((System.currentTimeMillis() / 1000) + 1800) // 30 minutes
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("usd")
                                .setUnitAmount((long) order.getTotalPrice() * 100)
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName("Order #" + order.getId() + " - Food Delivery")
                                        .setDescription("Restaurant: " + order.getRestaurant().getName())
                                        .build())
                                .build()
                        )
                        .build()
                ).build();
        Session session = Session.create(params);
        order.setPaymentTransactionId(session.getId());
        order.setPaymentStatus(PaymentStatus.PROCESSING);
        orderRepository.save(order);

        PaymentResponse response = new PaymentResponse();
        response.setPayment_url(session.getUrl());
        response.setSessionId(session.getId());
        return response;
    }

    @Override
    @Transactional
    public void handleWebhook(String payload, String sigHeader) {
        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.error("Invalid webhook signature: {}", e.getMessage());
            throw new SecurityException("Invalid webhook signature");
        }

        switch (event.getType()) {
            case "checkout.session.completed":
                handlePaymentSuccess(event);
                break;
            case "checkout.session.expired":
                handlePaymentExpired(event);
                break;
            case "payment_intent.payment_failed":
                handlePaymentFailed(event);
                break;
            default:
                log.info("Unhandled webhook event type: {}", event.getType());
        }
    }

    private void handlePaymentSuccess(Event event) {
        try {
            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject().orElse(null);
            if (session == null) {
                log.error("Failed to deserialize checkout session from webhook");
                return;
            }
            String orderIdStr = session.getMetadata().get("order_id");
            if (orderIdStr == null) {
                log.error("No order_id found in session metadata");
                return;
            }
            Long orderId = Long.parseLong(orderIdStr);
            Order order = orderService.getOrderById(orderId);

            if (!session.getId().equals(order.getPaymentTransactionId())) {
                log.error("Session ID mismatch for order: {}", orderId);
                return;
            }
            order.setPaymentStatus(PaymentStatus.COMPLETED);
            order.setPaymentDate(new Date());
            order.setOrderStatus(OrderStatus.CONFIRMED);
            order.setUpdatedAt(new Date());

            orderRepository.save(order);

            log.info("Payment confirmed for order: {} via webhook", orderId);

        } catch (Exception e) {
            log.error("Error processing payment success webhook: {}", e.getMessage(), e);
        }
    }

    private void handlePaymentExpired(Event event) {
        try {
            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject().orElse(null);

            if (session != null) {
                String orderIdStr = session.getMetadata().get("order_id");
                if (orderIdStr != null) {
                    Long orderId = Long.parseLong(orderIdStr);
                    Order order = orderService.getOrderById(orderId);

                    order.setPaymentStatus(PaymentStatus.FAILED);
                    order.setOrderStatus(OrderStatus.CANCELLED);
                    order.setCancelledAt(new Date());
                    order.setUpdatedAt(new Date());
                    orderRepository.save(order);

                    log.info("Payment session expired for order: {}", orderId);
                }
            }
        } catch (Exception e) {
            log.error("Error processing payment expiry webhook: {}", e.getMessage(), e);
        }
    }


    private void handlePaymentFailed(Event event) {
        log.info("Payment failed webhook received");
    }

    @Override
    public boolean verifyPaymentStatus(String sessionId) {
        try {
            Stripe.apiKey = stripeSecretKey;
            Session session = Session.retrieve(sessionId);

            return "complete".equals(session.getStatus()) &&
                    "paid".equals(session.getPaymentStatus());

        } catch (StripeException e) {
            log.error("Error verifying payment status: {}", e.getMessage());
            return false;
        }
    }

}
