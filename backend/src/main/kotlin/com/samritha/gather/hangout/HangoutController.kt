package com.samritha.gather.hangout
import com.samritha.gather.rsvp.HangoutRsvpsResponse
import com.samritha.gather.rsvp.RsvpService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID


@RestController
@RequestMapping("/api/hangouts")
class HangoutController(
    private val hangoutService: HangoutService,
    private val rsvpService: RsvpService
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createHangout(
        @AuthenticationPrincipal jwt: Jwt,
        @Valid @RequestBody request: CreateHangoutRequest
    ): HangoutResponse {
        return hangoutService.createHangout(
            organizerId = jwt.organizerId(),
            request = request
        )
    }

    @GetMapping
    fun getHangouts(
        @AuthenticationPrincipal jwt: Jwt
    ): List<HangoutResponse> {
        return hangoutService.getHangouts(
            organizerId = jwt.organizerId()
        )
    }

    @GetMapping("/{id}")
    fun getHangout(
        @AuthenticationPrincipal jwt: Jwt,
        @PathVariable id: UUID
    ): HangoutResponse {
        return hangoutService.getHangout(
            organizerId = jwt.organizerId(),
            hangoutId = id
        )
    }

    @GetMapping("/{id}/rsvps")
fun getHangoutRsvps(
    @AuthenticationPrincipal jwt: Jwt,
    @PathVariable id: UUID
): HangoutRsvpsResponse {
    return rsvpService.getOrganizerRsvps(
        organizerId = jwt.organizerId(),
        hangoutId = id
    )
}

    private fun Jwt.organizerId(): UUID {
        return try {
            UUID.fromString(subject)
        } catch (exception: IllegalArgumentException) {
            throw IllegalStateException(
                "JWT subject is not a valid user ID",
                exception
            )
        }
    }
}