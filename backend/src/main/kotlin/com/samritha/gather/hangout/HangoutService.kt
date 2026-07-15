package com.samritha.gather.hangout

import com.samritha.gather.user.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.security.SecureRandom
import java.util.UUID

@Service
class HangoutService(
    private val hangoutRepository: HangoutRepository,
    private val userRepository: UserRepository
) {

    private val secureRandom = SecureRandom()

    @Transactional
    fun createHangout(
        organizerId: UUID,
        request: CreateHangoutRequest
    ): HangoutResponse {
        val organizer = userRepository.findById(organizerId)
            .orElseThrow {
                ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authenticated user no longer exists"
                )
            }

        if (
            request.endTime != null &&
            !request.endTime.isAfter(request.startTime)
        ) {
            throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "End time must be after start time"
            )
        }

        val hangout = Hangout(
            organizer = organizer,
            title = request.title.trim(),
            description = request.description
                ?.trim()
                ?.takeIf { it.isNotEmpty() },
            location = request.location
                ?.trim()
                ?.takeIf { it.isNotEmpty() },
            startTime = request.startTime,
            endTime = request.endTime,
            inviteCode = generateUniqueInviteCode()
        )

        return hangoutRepository
            .save(hangout)
            .toResponse()
    }

    private fun generateUniqueInviteCode(): String {
        repeat(10) {
            val code = buildString {
                repeat(8) {
                    append(
                        INVITE_CHARACTERS[
                            secureRandom.nextInt(INVITE_CHARACTERS.length)
                        ]
                    )
                }
            }

            if (!hangoutRepository.existsByInviteCode(code)) {
                return code
            }
        }

        throw IllegalStateException(
            "Unable to generate a unique invite code"
        )
    }

    private fun Hangout.toResponse(): HangoutResponse {
        return HangoutResponse(
            id = id,
            title = title,
            description = description,
            location = location,
            startTime = startTime,
            endTime = endTime,
            inviteCode = inviteCode,
            createdAt = createdAt
        )
    }

    companion object {
        private const val INVITE_CHARACTERS =
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    }

    @Transactional(readOnly = true)
fun getHangouts(organizerId: UUID): List<HangoutResponse> {
    return hangoutRepository
        .findAllByOrganizerIdOrderByStartTimeAsc(organizerId)
        .map { it.toResponse() }
}

@Transactional(readOnly = true)
fun getHangout(
    organizerId: UUID,
    hangoutId: UUID
): HangoutResponse {
    val hangout = hangoutRepository.findByIdAndOrganizerId(
        id = hangoutId,
        organizerId = organizerId
    ) ?: throw ResponseStatusException(
        HttpStatus.NOT_FOUND,
        "Hangout not found"
    )

    return hangout.toResponse()
}
}