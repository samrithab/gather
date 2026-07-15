package com.samritha.gather.hangout

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.time.OffsetDateTime

data class CreateHangoutRequest(

    @field:NotBlank(message = "Title is required")
    @field:Size(
        max = 150,
        message = "Title must be 150 characters or fewer"
    )
    val title: String,

    @field:Size(
        max = 1000,
        message = "Description must be 1000 characters or fewer"
    )
    val description: String? = null,

    @field:Size(
        max = 255,
        message = "Location must be 255 characters or fewer"
    )
    val location: String? = null,

    @field:NotNull(message = "Start time is required")
    val startTime: OffsetDateTime,

    val endTime: OffsetDateTime? = null
)