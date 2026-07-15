package com.samritha.gather.hangout

import java.time.OffsetDateTime
import java.util.UUID

data class HangoutResponse(
    val id: UUID,
    val title: String,
    val description: String?,
    val location: String?,
    val startTime: OffsetDateTime,
    val endTime: OffsetDateTime?,
    val inviteCode: String,
    val createdAt: OffsetDateTime
)