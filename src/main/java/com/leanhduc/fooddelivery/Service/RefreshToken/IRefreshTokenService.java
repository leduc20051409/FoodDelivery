package com.leanhduc.fooddelivery.Service.RefreshToken;

import com.leanhduc.fooddelivery.Model.RefreshToken;
import com.leanhduc.fooddelivery.Model.User;

public interface IRefreshTokenService {
    RefreshToken createRefreshToken(String email);

    User verifyRefreshToken(String tokenString);

    void revokeRefreshToken(String tokenString);

    void revokeAllTokensByUser(String email);

    RefreshToken rotateRefreshToken(String oldTokenString);

    void cleanupExpiredTokens();

    Long getActiveSessionCount(String email);
}
