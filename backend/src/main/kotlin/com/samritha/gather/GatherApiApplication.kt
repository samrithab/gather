package com.samritha.gather

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class GatherApiApplication

fun main(args: Array<String>) {
	runApplication<GatherApiApplication>(*args)
}
