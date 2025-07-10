package com.leanhduc.fooddelivery.RequestDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleCallbackRequest {
    private String code;
    private String redirectUri;
}
