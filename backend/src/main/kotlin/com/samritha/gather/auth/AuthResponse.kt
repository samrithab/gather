package com.samritha.gather.auth

import java.time.OffsetDateTime
import java.util.UUID

data class AuthResponse(
    val id: UUID,
    val name: String,
    val email: String,
    val createdAt: OffsetDateTime
)