package com.raithavarta.service

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class WeatherInfo(
    val temperature: Float,
    val condition: String,
    val humidity: Int,
    val location: String
)

class WeatherService {
    suspend fun getCurrentWeather(lat: Double, lon: Double): WeatherInfo = withContext(Dispatchers.IO) {
        // In a production app, use Retrofit to call a real weather API
        // Mocking response for now
        WeatherInfo(
            temperature = 28.5f,
            condition = "Sunny",
            humidity = 65,
            location = "Bengaluru"
        )
    }
}
