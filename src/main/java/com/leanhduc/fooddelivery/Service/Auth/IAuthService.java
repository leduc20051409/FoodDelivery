package com.leanhduc.fooddelivery.Service.Auth;

import com.leanhduc.fooddelivery.Response.AuthResponse;

public interface IAuthService {
    void requestPasswordReset(String email);
    String resetPassword(String token, String newPassword);

    String verifyResetToken(String token);
    AuthResponse authenticateWithGoogle(String code, String redirectUri);
}
