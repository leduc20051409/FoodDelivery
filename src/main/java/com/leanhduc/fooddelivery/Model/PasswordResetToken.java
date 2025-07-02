package com.leanhduc.fooddelivery.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class PasswordResetToken {

    private static final int EXPIRATION = 15;

    @Id
    @GeneratedValue (strategy = GenerationType.AUTO)
    private Long id;

    private String token;

    @OneToOne (targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    private LocalDateTime expiryDate;

    public PasswordResetToken() {
        this.expiryDate = LocalDateTime.now().plusMinutes(EXPIRATION);
    }

    public PasswordResetToken(String token, User user) {
        this();
        this.token = token;
        this.user = user;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }
}
