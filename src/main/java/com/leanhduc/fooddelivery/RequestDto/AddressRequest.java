package com.leanhduc.fooddelivery.RequestDto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddressRequest {
    @NotBlank
    private String streetAddress;
    @NotBlank
    private String city;
    private String stateProvince;
    private String postalCode;
    private String country;
    @NotBlank
    private String phoneNumber;
}
