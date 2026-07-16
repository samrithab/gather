package com.samritha.gather.rsvp

import com.samritha.gather.hangout.Hangout
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.OffsetDateTime
import java.util.UUID

@Entity
@Table(name = "rsvps")
class Rsvp(

    @Id
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hangout_id", nullable = false)
    val hangout: Hangout,

    @Column(name = "guest_name", nullable = false, length = 100)
    var guestName: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    var status: RsvpStatus,

    @Column(name = "responded_at", nullable = false)
    val respondedAt: OffsetDateTime = OffsetDateTime.now()
)