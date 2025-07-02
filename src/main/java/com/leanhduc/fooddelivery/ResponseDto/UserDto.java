package com.leanhduc.fooddelivery.ResponseDto;

import lombok.Data;

import java.util.List;

@Data
public class UserDto {
    private String email;
    private String fullName;
    private String role;
    private List<RestaurantDto> favorites;
    private String phoneNumber;
}
