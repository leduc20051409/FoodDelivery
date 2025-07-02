package com.leanhduc.fooddelivery.Service.Auth;

public interface IAuthService {
    void requestPasswordReset(String email);
    String resetPassword(String token, String newPassword);

    String verifyResetToken(String token);
}
