package com.leanhduc.fooddelivery.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class APIResponse<T> {
    private T data;
    private String message;
}
