package com.samritha.gather.auth

import java.util.UUID

data class LoginResponse(
    val accessToken: String,
    val tokenType: String = "Bearer",
    val expiresInSeconds: Long,
    val user: LoggedInUser
)

data class LoggedInUser(
    val id: UUID,
    val name: String,
    val email: String
)