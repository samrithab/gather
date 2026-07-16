package com.samritha.gather.rsvp

import com.samritha.gather.hangout.Hangout
import com.samritha.gather.hangout.HangoutRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

@Service
class RsvpService(
    private val hangoutRepository: HangoutRepository,
    private val rsvpRepository: RsvpRepository
) {

    @Transactional(readOnly = true)
    fun getPublicHangout(
        inviteCode: String
    ): PublicHangoutResponse {
        val hangout = findHangout(inviteCode)

        return hangout.toPublicResponse()
    }

    @Transactional
    fun submitRsvp(
        inviteCode: String,
        request: SubmitRsvpRequest
    ): RsvpResponse {
        val hangout = findHangout(inviteCode)

        val rsvp = Rsvp(
            hangout = hangout,
            guestName = request.guestName.trim(),
            status = request.status
        )

        return rsvpRepository
            .save(rsvp)
            .toResponse()
    }

    private fun findHangout(inviteCode: String): Hangout {
        return hangoutRepository.findByInviteCode(
            inviteCode.trim().uppercase()
        ) ?: throw ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Invite not found"
        )
    }

    private fun Hangout.toPublicResponse(): PublicHangoutResponse {
        return PublicHangoutResponse(
            id = id,
            title = title,
            description = description,
            location = location,
            startTime = startTime,
            endTime = endTime,
            inviteCode = inviteCode,
            organizerName = organizer.name
        )
    }

    private fun Rsvp.toResponse(): RsvpResponse {
        return RsvpResponse(
            id = id,
            guestName = guestName,
            status = status,
            respondedAt = respondedAt
        )
    }

    @Transactional(readOnly = true)
fun getOrganizerRsvps(
    organizerId: java.util.UUID,
    hangoutId: java.util.UUID
): HangoutRsvpsResponse {
    val hangout = hangoutRepository.findByIdAndOrganizerId(
        id = hangoutId,
        organizerId = organizerId
    ) ?: throw ResponseStatusException(
        HttpStatus.NOT_FOUND,
        "Hangout not found"
    )

    val responses = rsvpRepository
        .findAllByHangoutIdOrderByRespondedAtAsc(hangout.id)
        .map { it.toResponse() }

    val yes = rsvpRepository.countByHangoutIdAndStatus(
        hangout.id,
        RsvpStatus.YES
    )

    val maybe = rsvpRepository.countByHangoutIdAndStatus(
        hangout.id,
        RsvpStatus.MAYBE
    )

    val no = rsvpRepository.countByHangoutIdAndStatus(
        hangout.id,
        RsvpStatus.NO
    )

    return HangoutRsvpsResponse(
        hangoutId = hangout.id,
        summary = RsvpSummary(
            yes = yes,
            maybe = maybe,
            no = no,
            total = yes + maybe + no
        ),
        responses = responses
    )
}
}