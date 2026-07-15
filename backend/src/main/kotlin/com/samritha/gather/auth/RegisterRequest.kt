package com.samritha.gather.auth

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class RegisterRequest(

    @field:NotBlank(message = "Name is required")
    @field:Size(
        max = 100,
        message = "Name must be 100 characters or fewer"
    )
    val name: String,

    @field:NotBlank(message = "Email is required")
    @field:Email(message = "Email must be valid")
    @field:Size(
        max = 255,
        message = "Email must be 255 characters or fewer"
    )
    val email: String,

    @field:NotBlank(message = "Password is required")
    @field:Size(
        min = 8,
        max = 72,
        message = "Password must be between 8 and 72 characters"
    )
    val password: String
)