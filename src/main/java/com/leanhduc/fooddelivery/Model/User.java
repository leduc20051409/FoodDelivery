package com.leanhduc.fooddelivery.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.leanhduc.fooddelivery.ResponseDto.RestaurantDto;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"cart", "orders", "restaurant", "addresses"})
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullName;
    private String email;
    private String password;
    private RoleUser role = RoleUser.ROLE_CUSTOMER;

    @JsonIgnore
    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "customer")
    private List<Order> orders = new ArrayList<>();

    @JsonIgnore
    @OneToOne(mappedBy = "user")
    private Restaurant restaurant;

    @ElementCollection(fetch = FetchType.LAZY)
    private List<RestaurantDto> favorites;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_auth_providers", joinColumns = @JoinColumn(name = "user_id"))
    private Set<AuthProvider> authProviders = new HashSet<>();

    @Enumerated(EnumType.STRING)
    private ProviderType primaryAuthMethod;

    private String status;

    @Column(nullable = true)
    private String phoneNumber;
}
