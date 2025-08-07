package com.leanhduc.fooddelivery.Service.RefreshToken;

import com.leanhduc.fooddelivery.Configuration.JwtTokenUtils;
import com.leanhduc.fooddelivery.Exception.UnauthorizedAccessException;
import com.leanhduc.fooddelivery.Model.RefreshToken;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.Repository.RefreshTokenRepository;
import com.leanhduc.fooddelivery.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Comparator;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RefreshTokenService implements IRefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtTokenUtils jwtTokenUtils;

    @Override
    @Transactional
    public RefreshToken createRefreshToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedAccessException("User not found with email: " + email));
        String tokenString = jwtTokenUtils.generateRefreshToken(email);
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setCreatedAt(Instant.now());
        refreshToken.setToken(tokenString);
        refreshToken.setExpiryDate(Instant.now().plusSeconds(jwtTokenUtils.getRefreshTokenExpiration()));
        refreshToken.setRevoked(false);

        cleanupOldTokensForUser(user);

        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);
        return savedToken;
    }

    private void cleanupOldTokensForUser(User user) {
        var activeTokens = refreshTokenRepository.findValidTokensByUser(user, Instant.now());

        if (activeTokens.size() >= 3) {
            activeTokens.sort(Comparator.comparing(RefreshToken::getCreatedAt));
            for (int i = 0; i < activeTokens.size() - 2; i++) {
                RefreshToken oldToken = activeTokens.get(i);
                oldToken.setRevoked(true);
                refreshTokenRepository.save(oldToken);
            }
        }
    }

    @Override
    public User verifyRefreshToken(String tokenString) {
        if (!jwtTokenUtils.validateToken(tokenString)) {
            throw new UnauthorizedAccessException("Invalid refresh token");
        }
        if (!jwtTokenUtils.isTokenType(tokenString, "REFRESH")) {
            throw new UnauthorizedAccessException("Token is not a refresh token");
        }
        Optional<RefreshToken> refreshTokenOptional = refreshTokenRepository.findByToken(tokenString);
        if (refreshTokenOptional.isEmpty()) {
            throw new UnauthorizedAccessException("Refresh token not found");
        }
        RefreshToken refreshToken = refreshTokenOptional.get();
        if (!refreshToken.isValid()) {
            refreshTokenRepository.delete(refreshToken);
            throw new UnauthorizedAccessException("Refresh token is expired or revoked");
        }
        return refreshToken.getUser();
    }

    @Override
    public void revokeRefreshToken(String tokenString) {
        Optional<RefreshToken> refreshTokenOptional = refreshTokenRepository.findByToken(tokenString);
        if (refreshTokenOptional.isPresent()) {
            RefreshToken refreshToken = refreshTokenOptional.get();
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
        } else {
            throw new UnauthorizedAccessException("Refresh token not found");
        }
    }

    @Override
    public void revokeAllTokensByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedAccessException("User not found with email: " + email));
        refreshTokenRepository.revokeAllTokensByUser(user);
    }

    @Override
    @Transactional
    public RefreshToken rotateRefreshToken(String oldTokenString) {
        User user = verifyRefreshToken(oldTokenString);
        revokeRefreshToken(oldTokenString);
        RefreshToken newToken = createRefreshToken(user.getEmail());
        return newToken;
    }

    @Override
    @Scheduled (cron = "0 0 2 * * ?")
    public void cleanupExpiredTokens() {
        refreshTokenRepository.deleteExpiredTokens(Instant.now());
    }

    @Override
    public Long getActiveSessionCount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedAccessException("User not found with email: " + email));
        return refreshTokenRepository.countActiveTokensByUser(user, Instant.now());
    }
}
