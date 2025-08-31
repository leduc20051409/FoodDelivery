package com.leanhduc.fooddelivery.Utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;

@Getter
@Component
public class JwtTokenUtils {

    @Value ("${jwt.secretKey}")
    private String secretKey;

    @Value ("${jwt.accessTokenExpiration}")
    private long accessTokenExpiration;

    @Value ("${jwt.refreshTokenExpiration}")
    private long refreshTokenExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateAccessToken(Authentication authentication) {
        return generateAccessToken(authentication.getName(), populateAuthorities(authentication.getAuthorities()));
    }

    public String generateAccessToken(String email, String authorities) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("authorization", authorities);
        claims.put("tokenType", "ACCESS");
        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(new Date().getTime() + accessTokenExpiration * 1000)) // 15 minutes
                .signWith(getSigningKey())
                .compact();
    }

    public String generateRefreshToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("tokenType", "REFRESH");
        claims.put("tokenId", UUID.randomUUID().toString());
        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration((new Date(new Date().getTime() + refreshTokenExpiration))) // 7 days
                .signWith(getSigningKey())
                .compact();
    }

    public String getEmailFromToken(String token) {
        token = token.substring(7);
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build().parseSignedClaims(token)
                .getPayload();
//        String email = String.valueOf(claims.get("email"));
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isTokenType(String token, String type) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build().parseSignedClaims(token)
                .getPayload();
        String tokenType = String.valueOf(claims.get("tokenType"));
        return type.equals(tokenType);
    }

    public Date getExpirationFromToken(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getExpiration();
    }

    private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Set<String> auths = new HashSet<>();
        for (GrantedAuthority authority : authorities) {
            auths.add(authority.getAuthority());
        }
        return String.join(",", auths);
    }


}
