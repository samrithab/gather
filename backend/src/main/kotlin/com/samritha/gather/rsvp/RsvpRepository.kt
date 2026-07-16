package com.samritha.gather.rsvp

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface RsvpRepository : JpaRepository<Rsvp, UUID> {

    fun findAllByHangoutIdOrderByRespondedAtAsc(
        hangoutId: UUID
    ): List<Rsvp>

    fun countByHangoutIdAndStatus(
        hangoutId: UUID,
        status: RsvpStatus
    ): Long
}