package com.raithavarta.service

import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.content
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class GeminiService(private val apiKey: String) {
    private val model = GenerativeModel(
        modelName = "gemini-1.5-flash",
        apiKey = apiKey
    )

    suspend fun getAgriculturalAdvice(query: String, language: String): String = withContext(Dispatchers.IO) {
        try {
            val prompt = "As an expert agricultural AI, provide advice in $language for: $query. Keep it concise."
            val response = model.generateContent(prompt)
            response.text ?: "Could not generate advice at this moment."
        } catch (e: Exception) {
            "Error: ${e.message}"
        }
    }

    suspend fun analyzeCropImage(bitmap: android.graphics.Bitmap, language: String): String = withContext(Dispatchers.IO) {
        try {
            val inputContent = content {
                image(bitmap)
                text("Identify the crop disease and suggest 2 organic treatments in $language.")
            }
            val response = model.generateContent(inputContent)
            response.text ?: "Could not analyze the image."
        } catch (e: Exception) {
            "Error: ${e.message}"
        }
    }
}
