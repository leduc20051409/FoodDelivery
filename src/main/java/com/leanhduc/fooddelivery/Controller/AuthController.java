package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.RequestDto.*;
import com.leanhduc.fooddelivery.Response.AuthResponse;
import com.leanhduc.fooddelivery.Response.MessageResponse;
import com.leanhduc.fooddelivery.Response.ResetPasswordResponse;
import com.leanhduc.fooddelivery.Service.Auth.IAuthService;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping ("/auth")
public class AuthController {
    private final IUserService userService;
    private final IAuthService authService;

    @PostMapping ("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@Valid @RequestBody RegisterRequest user) throws Exception {
        AuthResponse response = userService.createUser(user);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping ("/signin")
    public ResponseEntity<AuthResponse> signIn(@RequestBody LoginRequest request) {
        AuthResponse response = userService.signIn(request);
        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
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

//    @PostMapping ("/google")
//    public ResponseEntity<AuthResponse> googleAuth(@RequestBody GoogleAuthRequest request) {
//        AuthResponse response = authService.authenticateWithGoogle(request.getAccessToken());
//        return new ResponseEntity<>(response, HttpStatus.OK);
//
//    }

    @PostMapping("/google/callback")
    public ResponseEntity<AuthResponse> googleCallback(@RequestBody GoogleCallbackRequest request) {
        AuthResponse response = authService.authenticateWithGoogle(request.getCode(), request.getRedirectUri());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshAccessToken(request.getRefreshToken());
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(@RequestBody RefreshTokenRequest request) {
        authService.logout(request.getRefreshToken());
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
