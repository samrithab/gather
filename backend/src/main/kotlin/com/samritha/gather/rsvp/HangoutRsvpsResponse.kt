package com.samritha.gather.rsvp

import java.util.UUID

data class HangoutRsvpsResponse(
    val hangoutId: UUID,
    val summary: RsvpSummary,
    val responses: List<RsvpResponse>
)