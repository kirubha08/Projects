package com.ems.dto.request;

import com.ems.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {


    @NotBlank(message = "First name is required")
    @Size(min = 3, max = 50)
    private String firstName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Confirm Password is required")
    private String confirmPassword;
 @NotBlank(message = "lastName name is required")
    @Size(min = 3, max = 50)
    private String lastName;


    private User.Role role;
}
