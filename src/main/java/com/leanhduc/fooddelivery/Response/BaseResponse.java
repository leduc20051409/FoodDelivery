package com.leanhduc.fooddelivery.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BaseResponse {
    private LocalDate timestamp;
    private String message;
}
