package com.leanhduc.fooddelivery.Configuration;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;

@Component
public class JwtTokenUtils {

    @Value("${jwt.secretKey}")
    private String secretKey;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }


    public String generateToken(Authentication authentication) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String roles = populateAuthorities(authorities);
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", authentication.getName());
        claims.put("authorization", roles);
        return Jwts.builder()
                .claims(claims)
                .issuedAt(new Date())
                .expiration((new Date(new Date().getTime() + 86400000)))
                .signWith(getSigningKey())
                .compact();
    }

    public String getEmailFromToken(String token) {
        token = token.substring(7);
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build().parseSignedClaims(token)
                .getPayload();
        String email = String.valueOf(claims.get("email"));
        return email;
    }

    private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Set<String> auths = new HashSet<>();
        for (GrantedAuthority authority : authorities) {
            auths.add(authority.getAuthority());
        }
        return String.join(",", auths);
    }
}
