package com.raithavarta.models

import java.util.Date

/**
 * Kotlin Data Models for Raitha-Varta
 * Use these to implement the Android version of the app using Kotlin & Jetpack Compose.
 */

data class LocalizedString(
    val en: String,
    val kn: String,
    val hi: String
)

data class Crop(
    val id: String,
    val name: String,
    val variety: String,
    val plantingDate: String,
    val area: String,
    val healthScore: Int,
    val status: String,
    val lastCheck: String,
    val image: String,
    val location: String
)

data class DiseaseAnalysis(
    val diseaseName: String,
    val cause: String,
    val severity: String, // "Low", "Medium", "High"
    val organicSolution: String,
    val chemicalSolution: String,
    val treatmentSteps: List<String>,
    val followUpDays: Int
)

data class AdvisoryFlashcard(
    val id: String,
    val image: String,
    val title: LocalizedString,
    val description: LocalizedString,
    val actionLine: LocalizedString,
    val dosageInfo: LocalizedString
)

data class WeatherAlert(
    val type: String, // "rain", "wind", "temp"
    val severity: String, // "low", "medium", "high"
    val message: LocalizedString,
    val timestamp: String
)

data class UserProfile(
    val uid: String,
    val name: String,
    val location: String,
    val primaryCrop: String,
    val language: String, // "en", "kn", "hi"
    val theme: String // "light", "dark"
)

data class AiInsight(
    val id: String,
    val content: String,
    val timestamp: Date = Date(),
    val category: String // "Advisory", "Warning", "Growth"
)

data class FarmActivity(
    val id: String,
    val type: String,
    val description: String,
    val date: Date,
    val isCompleted: Boolean = false
)
