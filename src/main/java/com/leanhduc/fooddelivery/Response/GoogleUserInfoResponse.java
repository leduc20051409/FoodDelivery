package com.leanhduc.fooddelivery.Response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GoogleUserInfoResponse {
    private String id;
    private String email;
    private String name;
    @JsonProperty ("given_name")
    private String givenName;
    @JsonProperty("family_name")
    private String familyName;
    private String picture;
    private String locale;
    @JsonProperty("verified_email")
    private boolean verifiedEmail;

    public String getSub() {
        return id;
    }
}
