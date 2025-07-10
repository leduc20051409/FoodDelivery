package com.leanhduc.fooddelivery.RequestDto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleAuthRequest {
    @NotBlank (message = "Access token is required")
    private String accessToken;
}