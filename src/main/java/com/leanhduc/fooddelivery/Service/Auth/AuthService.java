package com.leanhduc.fooddelivery.Service.Auth;

import com.leanhduc.fooddelivery.Configuration.JwtTokenUtils;
import com.leanhduc.fooddelivery.Exception.ResourceNotFoundException;
import com.leanhduc.fooddelivery.Exception.UnauthorizedAccessException;
import com.leanhduc.fooddelivery.Model.*;
import com.leanhduc.fooddelivery.Repository.CartRepository;
import com.leanhduc.fooddelivery.Repository.PasswordResetTokenRepository;
import com.leanhduc.fooddelivery.Repository.UserRepository;
import com.leanhduc.fooddelivery.Response.AuthResponse;
import com.leanhduc.fooddelivery.Response.GoogleTokenResponse;
import com.leanhduc.fooddelivery.Response.GoogleUserInfoResponse;
import com.leanhduc.fooddelivery.Service.Oauth2.GoogleService;
import com.leanhduc.fooddelivery.Service.RefreshToken.RefreshTokenService;
import com.leanhduc.fooddelivery.Service.SendEmail.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService implements IAuthService {
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final GoogleService googleService;
    private final JwtTokenUtils jwtTokenUtils;
    private final CartRepository cartRepository;
    private final RefreshTokenService refreshTokenService;

    @Override
    @Transactional
    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email).
                orElseThrow(() -> new ResourceNotFoundException("User with email " + email + " not found"));

        Optional<PasswordResetToken> existingToken = tokenRepository.findByUser(user);
        if (existingToken.isPresent()) {
            tokenRepository.delete(existingToken.get());
            tokenRepository.flush();
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user);
        tokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Override
    @Transactional
    public String resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token);
        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new IllegalStateException("Token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
        return user.getEmail();
    }

    @Override
    public String verifyResetToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token);

        if (resetToken == null) {
            throw new UnauthorizedAccessException("Invalid token");
        }

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new UnauthorizedAccessException("Token has expired");
        }

        return resetToken.getUser().getEmail();
    }

    @Override
    @Transactional
    public AuthResponse authenticateWithGoogle(String code, String redirectUri) {
        try {
            GoogleTokenResponse tokenResponse = googleService.exchangeCodeForToken(code, redirectUri);

            GoogleUserInfoResponse googleUserInfo = googleService.getUserInfo(tokenResponse.getAccessToken());

            if (googleUserInfo.getEmail() == null || googleUserInfo.getEmail().isEmpty()) {
                throw new UnauthorizedAccessException("Email not found from Google");
            }

            Optional<User> existingUser = userRepository.findByEmail(googleUserInfo.getEmail());
            User user;

            if (existingUser.isPresent()) {
                user = existingUser.get();
                boolean hasGoogleProvider = user.getAuthProviders().stream()
                        .anyMatch(p -> p.getProviderType() == ProviderType.GOOGLE);

                if (!hasGoogleProvider) {
                    AuthProvider googleProvider = new AuthProvider();
                    googleProvider.setProviderType(ProviderType.GOOGLE);
                    googleProvider.setProviderId(googleUserInfo.getId());
                    googleProvider.setCreatedAt(Instant.now());
                    user.getAuthProviders().add(googleProvider);
                }
                user.setFullName(googleUserInfo.getName());
                user = userRepository.save(user);

            } else {
                user = createNewGoogleUser(googleUserInfo);
            }

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    user.getEmail(),
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority(user.getRole().toString()))
            );

            String jwtToken = jwtTokenUtils.generateAccessToken(authentication);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getEmail());

            return new AuthResponse(
                    jwtToken,
                    refreshToken.getToken(),
                    "Google authentication successful",
                    user.getRole()
            );

        } catch (Exception e) {
            log.error("Google authentication failed: {}", e.getMessage());
            throw new UnauthorizedAccessException("Google authentication failed: " + e.getMessage());
        }
    }

    private User createNewGoogleUser(GoogleUserInfoResponse googleUserInfo) {
        User newUser = new User();
        newUser.setEmail(googleUserInfo.getEmail());
        newUser.setFullName(googleUserInfo.getName());
        newUser.setRole(RoleUser.ROLE_CUSTOMER);
        newUser.setPrimaryAuthMethod(ProviderType.GOOGLE);
        newUser.setStatus("ACTIVE");

        AuthProvider googleProvider = new AuthProvider();
        googleProvider.setProviderType(ProviderType.GOOGLE);
        googleProvider.setProviderId(googleUserInfo.getId());
        googleProvider.setCreatedAt(Instant.now());
        newUser.getAuthProviders().add(googleProvider);

        Cart cart = new Cart();
        cart.setCustomer(newUser);
        cartRepository.save(cart);
        newUser.setCart(cart);

        return userRepository.save(newUser);
    }

    @Override
    @Transactional
    public AuthResponse refreshAccessToken(String refreshToken) {
        User user = refreshTokenService.verifyRefreshToken(refreshToken);
        RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(refreshToken);
        String authorities = user.getRole().toString();
        String newAccessToken = jwtTokenUtils.generateAccessToken(user.getEmail(), authorities);

        return new AuthResponse(
                newAccessToken,
                newRefreshToken.getToken(),
                "Access token refreshed successfully",
                user.getRole());
    }

    @Override
    public void logout(String refreshToken) {
        refreshTokenService.revokeRefreshToken(refreshToken);
    }

    @Override
    public void logoutAllDevices(String email) {
        refreshTokenService.revokeAllTokensByUser(email);
    }
}
