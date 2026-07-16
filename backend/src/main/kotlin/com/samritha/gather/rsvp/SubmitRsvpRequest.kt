package com.samritha.gather.rsvp

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class SubmitRsvpRequest(

    @field:NotBlank(message = "Guest name is required")
    @field:Size(
        max = 100,
        message = "Guest name must be 100 characters or fewer"
    )
    val guestName: String,

    val status: RsvpStatus
)