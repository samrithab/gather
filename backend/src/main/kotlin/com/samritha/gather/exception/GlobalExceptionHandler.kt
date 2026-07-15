package com.samritha.gather.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.server.ResponseStatusException

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException::class)
    fun handleResponseStatusException(
        exception: ResponseStatusException
    ): ResponseEntity<ApiErrorResponse> {
        val status = exception.statusCode

        val response = ApiErrorResponse(
            status = status.value(),
            message = exception.reason ?: "Request failed"
        )

        return ResponseEntity
            .status(status)
            .body(response)
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(
        exception: MethodArgumentNotValidException
    ): ResponseEntity<ApiErrorResponse> {
        val validationErrors = exception.bindingResult
            .fieldErrors
            .associate { error ->
                error.field to (error.defaultMessage ?: "Invalid value")
            }

        val response = ApiErrorResponse(
            status = HttpStatus.BAD_REQUEST.value(),
            message = "Validation failed",
            validationErrors = validationErrors
        )

        return ResponseEntity
            .badRequest()
            .body(response)
    }

    @ExceptionHandler(Exception::class)
    fun handleUnexpectedException(
        exception: Exception
    ): ResponseEntity<ApiErrorResponse> {
        val response = ApiErrorResponse(
            status = HttpStatus.INTERNAL_SERVER_ERROR.value(),
            message = "An unexpected error occurred"
        )

        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(response)
    }
}