package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.RequestDto.LoginRequest;
import com.leanhduc.fooddelivery.RequestDto.RegisterRequest;
import com.leanhduc.fooddelivery.Response.AuthResponse;
import com.leanhduc.fooddelivery.Response.MessageResponse;
import com.leanhduc.fooddelivery.Response.ResetPasswordResponse;
import com.leanhduc.fooddelivery.Service.Auth.IAuthService;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
                new ResetPasswordResponse("Password reset successful",email),
                HttpStatus.OK
        );
    }

    @GetMapping ("/verify-reset-token/{token}")
    public ResponseEntity<ResetPasswordResponse> verifyResetToken(@PathVariable String token) {
        try {
            String email = authService.verifyResetToken(token);
            return new ResponseEntity<>(
                    new ResetPasswordResponse("Token is valid, you can reset your password", email),
                    HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ResetPasswordResponse("Token is invalid or expired", null),
                    HttpStatus.BAD_REQUEST
            );
        }
    }
}
