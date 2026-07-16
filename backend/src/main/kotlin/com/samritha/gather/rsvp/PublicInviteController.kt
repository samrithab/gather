package com.samritha.gather.rsvp

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/public/invites")
class PublicInviteController(
    private val rsvpService: RsvpService
) {

    @GetMapping("/{inviteCode}")
    fun getInvite(
        @PathVariable inviteCode: String
    ): PublicHangoutResponse {
        return rsvpService.getPublicHangout(inviteCode)
    }

    @PostMapping("/{inviteCode}/rsvps")
    @ResponseStatus(HttpStatus.CREATED)
    fun submitRsvp(
        @PathVariable inviteCode: String,
        @Valid @RequestBody request: SubmitRsvpRequest
    ): RsvpResponse {
        return rsvpService.submitRsvp(
            inviteCode = inviteCode,
            request = request
        )
    }
}