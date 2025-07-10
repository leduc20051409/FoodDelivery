package com.leanhduc.fooddelivery.Service.Oauth2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.leanhduc.fooddelivery.Response.GoogleTokenResponse;
import com.leanhduc.fooddelivery.Response.GoogleUserInfoResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${spring.security.oauth2.client.provider.google.user-info-uri}")
    private String googleUserInfoUrl;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    public GoogleUserInfoResponse getUserInfo(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<GoogleUserInfoResponse> response = restTemplate.exchange(
                    googleUserInfoUrl,
                    HttpMethod.GET,
                    entity,
                    GoogleUserInfoResponse.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                throw new RuntimeException("Failed to fetch user info from Google");
            }
        } catch (Exception e) {
            log.error("Error fetching user info from Google: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch user info from Google", e);
        }
    }

    public GoogleTokenResponse exchangeCodeForToken(String code, String redirectUri) {
        try {
            String tokenEndpoint = "https://oauth2.googleapis.com/token";
            String requestBody = String.format(
                    "client_id=%s&client_secret=%s&code=%s&grant_type=authorization_code&redirect_uri=%s",
                    clientId, clientSecret, code, redirectUri
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<GoogleTokenResponse> response = restTemplate.exchange(
                    tokenEndpoint,
                    HttpMethod.POST,
                    entity,
                    GoogleTokenResponse.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                throw new RuntimeException("Failed to exchange code for token");
            }

        } catch (Exception e) {
            log.error("Error exchanging code for token: {}", e.getMessage());
            throw new RuntimeException("Failed to exchange code for token", e);
        }
    }

    public boolean validateToken(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v1/tokeninfo",
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            log.error("Error validating Google token: {}", e.getMessage());
            return false;
        }
    }
}
