package com.raithavarta.util

import android.content.Context
import android.content.SharedPreferences
import com.raithavarta.viewmodel.AppLanguage

class SettingsManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("raitha_prefs", Context.MODE_PRIVATE)

    fun saveLanguage(language: AppLanguage) {
        prefs.edit().putString("app_lang", language.name).apply()
    }

    fun getLanguage(): AppLanguage {
        val langStr = prefs.getString("app_lang", AppLanguage.EN.name)
        return AppLanguage.valueOf(langStr ?: AppLanguage.EN.name)
    }

    fun setDarkMode(enabled: Boolean) {
        prefs.edit().putBoolean("dark_mode", enabled).apply()
    }

    fun isDarkMode(): Boolean = prefs.getBoolean("dark_mode", false)
}
