package com.leanhduc.fooddelivery.RequestDto;

import com.leanhduc.fooddelivery.Model.Address;
import com.leanhduc.fooddelivery.Model.ContactInfor;
import lombok.Data;

import java.util.List;

@Data
public class RestaurantRequest {
    private Long id;
    private String name;
    private String description;
    private String cuisineType;
    private Address address;
    private ContactInfor contactInfor;
    private String openingHours;
    private List<String> images;

}
