package com.leanhduc.fooddelivery.Service.Auth;

import com.leanhduc.fooddelivery.Response.AuthResponse;
import org.springframework.transaction.annotation.Transactional;

public interface IAuthService {
    void requestPasswordReset(String email);
    String resetPassword(String token, String newPassword);

    String verifyResetToken(String token);
    AuthResponse authenticateWithGoogle(String code, String redirectUri);

    @Transactional
    AuthResponse refreshAccessToken(String refreshToken);

    void logout(String refreshToken);

    void logoutAllDevices(String email);
}
