package com.leanhduc.fooddelivery.Service.Auth;

import com.leanhduc.fooddelivery.Exception.ResourceNotFoundException;
import com.leanhduc.fooddelivery.Model.PasswordResetToken;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.Repository.PasswordResetTokenRepository;
import com.leanhduc.fooddelivery.Repository.UserRepository;
import com.leanhduc.fooddelivery.Service.SendEmail.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email).
                orElseThrow(() -> new ResourceNotFoundException("User with email " + email + " not found"));

        Optional<PasswordResetToken> existingToken = tokenRepository.findByUser(user);
        if (existingToken.isPresent()) {
            tokenRepository.delete(existingToken.get());
            tokenRepository.flush();
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user);
        tokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Override
    @Transactional
    public String resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token);
        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new IllegalStateException("Token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
        return user.getEmail();
    }

    @Override
    public String verifyResetToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token);

        if (resetToken == null) {
            throw new IllegalStateException("Invalid token");
        }

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new IllegalStateException("Token has expired");
        }

        return resetToken.getUser().getEmail();
    }
}
