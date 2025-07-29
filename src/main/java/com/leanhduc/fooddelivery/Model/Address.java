package com.leanhduc.fooddelivery.Model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn (name = "user_id")
    @JsonIgnore
    private User user;

    @JsonIgnore
    @OneToMany (cascade = CascadeType.ALL, mappedBy = "deliveryAddress")
    private List<Order> orders = new ArrayList<>();

    private String streetAddress;
    private String city;
    private String stateProvince;
    private String postalCode;
    private String country;
    private String phoneNumber;
}
