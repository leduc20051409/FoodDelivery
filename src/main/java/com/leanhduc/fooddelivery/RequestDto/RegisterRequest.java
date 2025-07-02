package com.leanhduc.fooddelivery.RequestDto;

import com.leanhduc.fooddelivery.Model.RoleUser;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank (message = "Full name is required")
    @Size (min = 3, max = 50, message = "Full name must be between 3 and 50 characters")
    private String fullName;
    @NotBlank (message = "Email is required")
    private String email;
    @NotBlank (message = "Password is required")
    private String password;
    @NotNull (message = "Role is required")
    private RoleUser role;
}
