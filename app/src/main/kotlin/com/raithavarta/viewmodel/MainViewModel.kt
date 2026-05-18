package com.raithavarta.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.raithavarta.models.Crop
import com.raithavarta.data.CROP_LIST
import com.raithavarta.service.FirebaseManager
import com.raithavarta.service.GeminiService
import com.raithavarta.service.WeatherService
import com.raithavarta.service.WeatherInfo
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

enum class AppLanguage { EN, HI, KN }

class MainViewModel : ViewModel() {
    private val firebaseManager = FirebaseManager()
    private val weatherService = WeatherService()
    // In a real app, API key would come from BuildConfig or secrets
    private val geminiService = GeminiService(apiKey = "DUMMY_KEY")

    private val _language = MutableStateFlow(AppLanguage.EN)
    val language: StateFlow<AppLanguage> = _language.asStateFlow()

    private val _crops = MutableStateFlow<List<Crop>>(CROP_LIST)
    val crops: StateFlow<List<Crop>> = _crops.asStateFlow()

    private val _isRefreshing = MutableStateFlow(false)
    val isRefreshing: StateFlow<Boolean> = _isRefreshing.asStateFlow()

    private val _weather = MutableStateFlow<WeatherInfo?>(null)
    val weather: StateFlow<WeatherInfo?> = _weather.asStateFlow()

    init {
        fetchCrops()
        fetchWeather()
    }

    fun setLanguage(newLanguage: AppLanguage) {
        _language.value = newLanguage
    }

    private fun fetchCrops() {
        viewModelScope.launch {
            val cloudCrops = firebaseManager.getCrops()
            if (cloudCrops.isNotEmpty()) {
                _crops.value = cloudCrops
            }
        }
    }

    private fun fetchWeather() {
        viewModelScope.launch {
            _weather.value = weatherService.getCurrentWeather(12.9716, 77.5946)
        }
    }

    fun refreshCrops() {
        viewModelScope.launch {
            _isRefreshing.value = true
            val cloudCrops = firebaseManager.getCrops()
            if (cloudCrops.isNotEmpty()) {
                _crops.value = cloudCrops
            }
            _isRefreshing.value = false
        }
    }

    fun addCrop(crop: Crop) {
        viewModelScope.launch {
            firebaseManager.addCrop(crop)
            _crops.value = _crops.value + crop
        }
    }

    fun getAiAdvice(query: String, lang: String, onResult: (String) -> Unit) {
        viewModelScope.launch {
            val advice = geminiService.getAgriculturalAdvice(query, lang)
            onResult(advice)
        }
    }
}
