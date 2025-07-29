package com.leanhduc.fooddelivery.Model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"customer", "restaurant", "items", "deliveryAddress"})
@Table (name = "orders")
public class Order {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User customer;

    @JsonIgnore
    @ManyToOne
    private Restaurant restaurant;

    @Enumerated (EnumType.STRING)
    private OrderStatus orderStatus;

    private Date creatAt;

    private Date updatedAt;

    private Date cancelledAt;

    @ManyToOne
    private Address deliveryAddress;

    @OneToMany
    private List<OrderItem> items;

    private int totalItem;
    private Long totalPrice;

    @Enumerated (EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated (EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private String paymentTransactionId;

    private Date paymentDate;

    private Boolean cancellable = true;

    public boolean canBeCancelled() {
        return cancellable &&
                (orderStatus == OrderStatus.PENDING ||
                        orderStatus == OrderStatus.CONFIRMED) &&
                cancelledAt == null;
    }
}

