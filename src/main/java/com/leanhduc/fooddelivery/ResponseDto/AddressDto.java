package com.leanhduc.fooddelivery.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressDto {
    private Long id;
    private String streetAddress;
    private String city;
    private String stateProvince;
    private String postalCode;
    private String country;
    private String phoneNumber;
}
