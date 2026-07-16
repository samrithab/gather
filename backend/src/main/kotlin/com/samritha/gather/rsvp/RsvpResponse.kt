package com.samritha.gather.rsvp

import java.time.OffsetDateTime
import java.util.UUID

data class RsvpResponse(
    val id: UUID,
    val guestName: String,
    val status: RsvpStatus,
    val respondedAt: OffsetDateTime
)