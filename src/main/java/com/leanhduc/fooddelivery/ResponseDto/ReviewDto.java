package com.leanhduc.fooddelivery.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDto {
    private Long id;
    private String customerName;
    private Integer rating;
    private String comment;
    private Date reviewDate;
    private Long orderId;
    private String orderItems;
    private boolean verified;
}
