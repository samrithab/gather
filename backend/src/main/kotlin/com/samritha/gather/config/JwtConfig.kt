package com.samritha.gather.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder
import java.nio.charset.StandardCharsets
import javax.crypto.SecretKey
import javax.crypto.spec.SecretKeySpec

@Configuration
class JwtConfig(
    @Value("\${app.jwt.secret}")
    private val jwtSecret: String
) {

    @Bean
    fun jwtSecretKey(): SecretKey {
        return SecretKeySpec(
            jwtSecret.toByteArray(StandardCharsets.UTF_8),
            "HmacSHA256"
        )
    }

    @Bean
    fun jwtEncoder(secretKey: SecretKey): JwtEncoder {
        return NimbusJwtEncoder
            .withSecretKey(secretKey)
            .build()
    }

    @Bean
    fun jwtDecoder(secretKey: SecretKey): JwtDecoder {
        return NimbusJwtDecoder
            .withSecretKey(secretKey)
            .build()
    }
}