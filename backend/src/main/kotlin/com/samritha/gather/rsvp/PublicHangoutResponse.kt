package com.samritha.gather.rsvp

import java.time.OffsetDateTime
import java.util.UUID

data class PublicHangoutResponse(
    val id: UUID,
    val title: String,
    val description: String?,
    val location: String?,
    val startTime: OffsetDateTime,
    val endTime: OffsetDateTime?,
    val inviteCode: String,
    val organizerName: String
)