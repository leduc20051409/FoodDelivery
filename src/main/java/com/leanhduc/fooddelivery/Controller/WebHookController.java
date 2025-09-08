package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.Model.Order;
import com.leanhduc.fooddelivery.Model.PaymentMethod;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.Response.PaymentVerificationResponse;
import com.leanhduc.fooddelivery.Service.Order.IOrderService;
import com.leanhduc.fooddelivery.Service.Payment.IPaymentService;
import com.leanhduc.fooddelivery.Service.Payment.PaymentServiceFactory;
import com.leanhduc.fooddelivery.Service.Payment.VNPayService;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping ("/api/webhooks")
public class WebHookController {

    private final PaymentServiceFactory paymentServiceFactory;
    private final IUserService userService;
    private final IOrderService orderService;

    @Value ("${app.frontend.url}")
    private String frontendUrl;

    @PostMapping ("/stripe")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader ("Stripe-Signature") String sigHeader) {
        IPaymentService paymentService = paymentServiceFactory.getPaymentService(PaymentMethod.STRIPE_PAY);
        paymentService.handleWebhook(payload, sigHeader);
        return ResponseEntity.ok("Webhook processed successfully");
    }

    @GetMapping ("/verify-payment/{sessionId}")
    public ResponseEntity<?> verifyPayment(@PathVariable String sessionId,
                                           @RequestHeader ("Authorization") String jwt) {
        User user = userService.findByJwtToken(jwt);
        Order order = orderService.getOrderByPaymentTransactionId(sessionId);
        if (!order.getCustomer().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new PaymentVerificationResponse(false, "Access denied"));
        }
        IPaymentService paymentService = paymentServiceFactory.getPaymentService(order.getPaymentMethod());
        boolean isVerified = paymentService.verifyPaymentStatus(sessionId);
        if (isVerified) {
            return ResponseEntity.ok()
                    .body(new PaymentVerificationResponse(true, "Payment verified"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new PaymentVerificationResponse(false, "Payment not completed"));
        }
    }

    @GetMapping ("/vnpay/return")
    public void handleVnPayReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
        VNPayService vnPayService = (VNPayService) paymentServiceFactory.getPaymentService(PaymentMethod.VN_PAY);
        Map<String, Object> result = vnPayService.processVnPayReturn(request);

        boolean success = (boolean) result.get("success");
        Long orderId = (Long) result.get("orderId");
        if (success) {
            response.sendRedirect(frontendUrl + "/payment/success?orderId=" + orderId);
        } else {
            String message = (String) result.get("message");
            response.sendRedirect(frontendUrl + "/payment/failed?orderId=" + orderId + "&message=" + message);
        }
    }

    @GetMapping("/status/{paymentMethod}/{transactionId}")
    public ResponseEntity<?> checkPaymentStatus(
            @PathVariable String paymentMethod,
            @PathVariable String transactionId,
            @RequestHeader("Authorization") String jwt) {
        PaymentMethod method = PaymentMethod.valueOf(paymentMethod.toUpperCase());
        IPaymentService paymentService = paymentServiceFactory.getPaymentService(method);

        boolean isCompleted = paymentService.verifyPaymentStatus(transactionId);

        Map<String, Object> response = new HashMap<>();
        response.put("transactionId", transactionId);
        response.put("completed", isCompleted);
        response.put("status", isCompleted ? "COMPLETED" : "PENDING");
        response.put("paymentMethod", method);

        return ResponseEntity.ok(response);
    }
}
