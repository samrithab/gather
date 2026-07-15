package com.samritha.gather.auth

import com.samritha.gather.user.User
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.oauth2.jose.jws.MacAlgorithm
import org.springframework.security.oauth2.jwt.JwsHeader
import org.springframework.security.oauth2.jwt.JwtClaimsSet
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.JwtEncoderParameters
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit

@Service
class JwtService(
    private val jwtEncoder: JwtEncoder,

    @Value("\${app.jwt.expiration-minutes}")
    private val expirationMinutes: Long
) {

    fun generateToken(user: User): String {
        val issuedAt = Instant.now()
        val expiresAt = issuedAt.plus(
            expirationMinutes,
            ChronoUnit.MINUTES
        )

        val claims = JwtClaimsSet.builder()
            .issuer("gather-api")
            .issuedAt(issuedAt)
            .expiresAt(expiresAt)
            .subject(user.id.toString())
            .claim("email", user.email)
            .claim("name", user.name)
            .build()

        val header = JwsHeader
            .with(MacAlgorithm.HS256)
            .build()

        return jwtEncoder
            .encode(JwtEncoderParameters.from(header, claims))
            .tokenValue
    }

    fun expirationSeconds(): Long {
        return expirationMinutes * 60
    }
}