package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.Model.Order;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.Response.PaymentVerificationResponse;
import com.leanhduc.fooddelivery.Service.Order.IOrderService;
import com.leanhduc.fooddelivery.Service.Payment.IPaymentService;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping ("/api/webhooks")
public class WebHookController {

    private final IPaymentService paymentService;
    private final IUserService userService;
    private final IOrderService orderService;

    @PostMapping ("/stripe")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader ("Stripe-Signature") String sigHeader) {
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
        boolean isVerified = paymentService.verifyPaymentStatus(sessionId);
        if (isVerified) {
            return ResponseEntity.ok()
                    .body(new PaymentVerificationResponse(true, "Payment verified"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new PaymentVerificationResponse(false, "Payment not completed"));
        }
    }
}
