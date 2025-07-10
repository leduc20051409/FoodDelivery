package com.leanhduc.fooddelivery.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.time.Instant;

@Embeddable
@Data
public class AuthProvider {

    @Enumerated (EnumType.STRING)
    private ProviderType providerType;

    private String providerId;

    @Column (nullable = false)
    private Instant createdAt;
}
