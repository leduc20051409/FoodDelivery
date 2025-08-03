package com.leanhduc.fooddelivery.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
public class Review {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User customer;

    @ManyToOne
    private Restaurant restaurant;

    @ManyToOne
    private Order order;

    private int rating;
    private String comment;
    private Date reviewDate;
    private boolean verified = true;
}