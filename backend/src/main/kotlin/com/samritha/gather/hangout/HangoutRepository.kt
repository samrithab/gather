package com.samritha.gather.hangout

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface HangoutRepository : JpaRepository<Hangout, UUID> {

    fun findAllByOrganizerIdOrderByStartTimeAsc(
        organizerId: UUID
    ): List<Hangout>

    fun findByIdAndOrganizerId(
        id: UUID,
        organizerId: UUID
    ): Hangout?

    fun existsByInviteCode(inviteCode: String): Boolean

    fun findByInviteCode(inviteCode: String): Hangout?
}