package com.leanhduc.fooddelivery.Response;

import com.leanhduc.fooddelivery.Model.RoleUser;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String message;
    private RoleUser role;

}
