package com.leanhduc.fooddelivery.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Food {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Long price;

    @ManyToOne
    private Category category;

    @Column(length = 1000)
    @ElementCollection
    private List<String> images;

    private boolean available;

//    @JsonIgnore
    @ManyToOne
    private Restaurant restaurant;

    private boolean isVegetarian;
    private boolean isSeasonal;

    @ManyToMany
    private List<IngredientItems> ingredientItems = new ArrayList<>();

    private Date creationDate;
}
