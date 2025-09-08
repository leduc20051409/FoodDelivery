package com.leanhduc.fooddelivery.Service.Payment;

import com.leanhduc.fooddelivery.Exception.ResourceNotFoundException;
import com.leanhduc.fooddelivery.Model.PaymentMethod;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class PaymentServiceFactory {
    private final StripePaymentService stripePaymentService;
    private final VNPayService vnPayService;

    private final Map<PaymentMethod, IPaymentService> paymentServiceMap = new EnumMap<>(PaymentMethod.class);

    @PostConstruct
    public void init(){
        paymentServiceMap.put(PaymentMethod.STRIPE_PAY, stripePaymentService);
        paymentServiceMap.put(PaymentMethod.VN_PAY, vnPayService);
    }

    public IPaymentService getPaymentService(PaymentMethod method) {
        IPaymentService strategy = paymentServiceMap.get(method);
        if (strategy == null) {
            throw new ResourceNotFoundException("Payment method not supported: " + method);
        }
        return strategy;
    }
}
