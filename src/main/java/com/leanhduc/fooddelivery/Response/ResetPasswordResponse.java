package com.leanhduc.fooddelivery.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResetPasswordResponse {
    String message;
    String email;
}
