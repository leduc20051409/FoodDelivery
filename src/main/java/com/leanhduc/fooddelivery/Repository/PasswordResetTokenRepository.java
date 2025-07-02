package com.leanhduc.fooddelivery.Repository;

import com.leanhduc.fooddelivery.Model.PasswordResetToken;
import com.leanhduc.fooddelivery.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetToken findByToken(String token);
    void deleteByUser(User user);

    Optional<PasswordResetToken> findByUser(User user);
}
