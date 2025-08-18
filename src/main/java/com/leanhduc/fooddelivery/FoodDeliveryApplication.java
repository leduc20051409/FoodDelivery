package com.leanhduc.fooddelivery;

import com.leanhduc.fooddelivery.Service.RefreshToken.RefreshTokenService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
//@EnableScheduling
public class FoodDeliveryApplication implements CommandLineRunner {

    private final RefreshTokenService tokenService;

    public FoodDeliveryApplication(RefreshTokenService tokenService) {
        this.tokenService = tokenService;
    }

    public static void main(String[] args) {
        SpringApplication.run(FoodDeliveryApplication.class, args);
    }

    @Override
    public void run(String... args) {
        tokenService.cleanupExpiredTokens();
    }

}
