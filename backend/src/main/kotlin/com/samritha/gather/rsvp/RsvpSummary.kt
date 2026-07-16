package com.samritha.gather.rsvp

data class RsvpSummary(
    val yes: Long,
    val maybe: Long,
    val no: Long,
    val total: Long
)