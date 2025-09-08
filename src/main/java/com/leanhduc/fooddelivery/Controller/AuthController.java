package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.Exception.UnauthorizedAccessException;
import com.leanhduc.fooddelivery.RequestDto.*;
import com.leanhduc.fooddelivery.Response.AuthResponse;
import com.leanhduc.fooddelivery.Response.MessageResponse;
import com.leanhduc.fooddelivery.Response.ResetPasswordResponse;
import com.leanhduc.fooddelivery.Service.Auth.IAuthService;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import static com.leanhduc.fooddelivery.Utils.CookieUtil.clearRefreshTokenCookie;
import static com.leanhduc.fooddelivery.Utils.CookieUtil.setRefreshTokenCookie;

@RestController
@AllArgsConstructor
@RequestMapping ("/auth")
public class AuthController {
    private final IUserService userService;
    private final IAuthService authService;

    @PostMapping ("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(
            @Valid @RequestBody RegisterRequest user,
            HttpServletResponse response) throws Exception {
        AuthResponse authResponse  = userService.createUser(user);
        setRefreshTokenCookie(response, authResponse.getRefreshToken());
        authResponse.setRefreshToken(null);
        return new ResponseEntity<>(authResponse , HttpStatus.CREATED);
    }

    @PostMapping ("/signin")
    public ResponseEntity<AuthResponse> signIn(
            @RequestBody LoginRequest request,
            HttpServletResponse response) {
        AuthResponse authResponse = userService.signIn(request);
        setRefreshTokenCookie(response, authResponse.getRefreshToken());

        authResponse.setRefreshToken(null);

        return new ResponseEntity<>(authResponse, HttpStatus.ACCEPTED);
    }

    @PostMapping ("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@RequestParam String email) {
        authService.requestPasswordReset(email);
        return new ResponseEntity<>(
                new MessageResponse("Password reset link has been sent to your email"),
                HttpStatus.OK
        );
    }

    @PostMapping ("/reset-password")
    public ResponseEntity<ResetPasswordResponse> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {
        String email = authService.resetPassword(token, newPassword);
        return new ResponseEntity<>(
                new ResetPasswordResponse("Password reset successful", email),
                HttpStatus.OK
        );
    }

    @GetMapping ("/verify-reset-token/{token}")
    public ResponseEntity<ResetPasswordResponse> verifyResetToken(@PathVariable String token) {
        String email = authService.verifyResetToken(token);
        return new ResponseEntity<>(
                new ResetPasswordResponse("Token is valid, you can reset your password", email),
                HttpStatus.OK
        );

    }


    @PostMapping("/google/callback")
    public ResponseEntity<AuthResponse> googleCallback(
            @RequestBody GoogleCallbackRequest request,
            HttpServletResponse response) {
        AuthResponse authResponse = authService.authenticateWithGoogle(request.getCode(), request.getRedirectUri());
        setRefreshTokenCookie(response, authResponse.getRefreshToken());
        authResponse.setRefreshToken(null);
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }
        if (refreshToken == null) {
            throw new UnauthorizedAccessException("Refresh token not found in cookies");
        }
        AuthResponse authResponse = authService.refreshAccessToken(refreshToken);
        setRefreshTokenCookie(response, authResponse.getRefreshToken());
        authResponse.setRefreshToken(null);
        return new ResponseEntity<>(authResponse, HttpStatus.OK);

    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            HttpServletRequest request,
            HttpServletResponse response) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken != null) {
            authService.logout(refreshToken);
        }
        clearRefreshTokenCookie(response);
        return new ResponseEntity<>(
                new MessageResponse("Logout successful"),
                HttpStatus.OK
        );
    }

    @PostMapping("/logout-all")
    public ResponseEntity<MessageResponse> logoutAllDevices(Authentication authentication) {
        String email = authentication.getName();
        authService.logoutAllDevices(email);
        return new ResponseEntity<>(
                new MessageResponse("Logout successful"),
                HttpStatus.OK
        );
    }

}
