package com.leanhduc.fooddelivery.Utils;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

import java.time.Duration;

public class CookieUtil {
    public static void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false) // Set to true if using HTTPS
                .path("/")
                .maxAge(Duration.ofDays(7))
                .sameSite("Lax") // Use "Strict" or "Lax" based on your requirements
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public static void clearRefreshTokenCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false) // Set to true if using HTTPS
                .path("/")
                .maxAge(Duration.ZERO)
                .sameSite("Lax") // Use "Strict" or "Lax" based on your requirements
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
