package com.leanhduc.fooddelivery.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentVerificationResponse {
    boolean verified;
    String message;

}
