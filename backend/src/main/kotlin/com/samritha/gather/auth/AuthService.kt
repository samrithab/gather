package com.samritha.gather.auth

import com.samritha.gather.user.User
import com.samritha.gather.user.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.util.Locale

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
) {

    fun register(request: RegisterRequest): AuthResponse {
        val normalizedEmail = normalizeEmail(request.email)

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw ResponseStatusException(
                HttpStatus.CONFLICT,
                "An account with this email already exists"
            )
        }

        val passwordHash = requireNotNull(
            passwordEncoder.encode(request.password)
        ) {
            "Password encoder returned null"
        }

        val user = User(
            name = request.name.trim(),
            email = normalizedEmail,
            passwordHash = passwordHash
        )

        val savedUser = userRepository.save(user)

        return AuthResponse(
            id = savedUser.id,
            name = savedUser.name,
            email = savedUser.email,
            createdAt = savedUser.createdAt
        )
    }

    fun login(request: LoginRequest): LoginResponse {
        val normalizedEmail = normalizeEmail(request.email)

        val user = userRepository.findByEmail(normalizedEmail)
            ?: throw invalidCredentials()

        if (!passwordEncoder.matches(request.password, user.passwordHash)) {
            throw invalidCredentials()
        }

        return LoginResponse(
            accessToken = jwtService.generateToken(user),
            expiresInSeconds = jwtService.expirationSeconds(),
            user = LoggedInUser(
                id = user.id,
                name = user.name,
                email = user.email
            )
        )
    }

    private fun normalizeEmail(email: String): String {
        return email
            .trim()
            .lowercase(Locale.ROOT)
    }

    private fun invalidCredentials(): ResponseStatusException {
        return ResponseStatusException(
            HttpStatus.UNAUTHORIZED,
            "Invalid email or password"
        )
    }
}