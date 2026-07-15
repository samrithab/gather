package com.samritha.gather.exception

import java.time.Instant

data class ApiErrorResponse(
    val status: Int,
    val message: String,
    val timestamp: Instant = Instant.now(),
    val validationErrors: Map<String, String>? = null
)