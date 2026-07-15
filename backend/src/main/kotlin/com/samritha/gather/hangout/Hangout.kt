package com.samritha.gather.hangout

import com.samritha.gather.user.User
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.OffsetDateTime
import java.util.UUID

@Entity
@Table(name = "hangouts")
class Hangout(

    @Id
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "organizer_id", nullable = false)
    val organizer: User,

    @Column(nullable = false, length = 150)
    var title: String,

    @Column(length = 1000)
    var description: String? = null,

    @Column(length = 255)
    var location: String? = null,

    @Column(name = "start_time", nullable = false)
    var startTime: OffsetDateTime,

    @Column(name = "end_time")
    var endTime: OffsetDateTime? = null,

    @Column(name = "invite_code", nullable = false, unique = true, length = 20)
    val inviteCode: String,

    @Column(name = "created_at", nullable = false)
    val createdAt: OffsetDateTime = OffsetDateTime.now()
)